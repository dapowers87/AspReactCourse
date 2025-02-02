import { RootStore } from "./rootStore";
import { observable, action, runInAction, computed } from "mobx";
import { IProfile, IPhoto, IProfileFormValues } from "../models/profile";
import agent from "../api/agent";
import { toast } from "react-toastify";

export default class ProfileStore {
    rootStore: RootStore
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }

    @observable profile: IProfile | null = null;
    @observable loadingProfile = true;
    @observable uploadingPhoto = false;
    @observable loading = false;
    @observable updatingBio = false;

    @computed get isCurrentUser() {
        if(this.rootStore.userStore.user && this.profile) {
            return this.rootStore.userStore.user.username === this.profile.username;
        } else {
            return false;
        }
    }

    @action loadProfile = async (username: string) => {
        this.loadingProfile = true;

        try {
            const profile = await agent.Profiles.get(username);

            runInAction('loading profile', () => {
                this.profile = profile;
                this.loadingProfile = false;
            });
        } catch (error) {
            runInAction('error loading profile', () => {
                this.loadingProfile = false;
            });
            console.log(error);
        }
    }

    @action uploadPhoto = async (file: Blob) => {
        this.uploadingPhoto = true;
        try {
            const photo = await agent.Profiles.uploadPhoto(file);
            runInAction('uploading photo', () => {
                if(this.profile) { 
                    this.profile.photos.push(photo);
                    if(photo.isMain && this.rootStore.userStore.user)
                    {
                        this.rootStore.userStore.user.image = photo.url;
                        this.profile.image = photo.url;
                    }
                }
                this.uploadingPhoto = false;
            })
            
        } catch (error) {
            console.log(error);
            toast.error('Problem uploading photo');

            runInAction('error in uploading photo', () => {
                this.uploadingPhoto = false;
            })
        }
    }

    @action setMainPhoto = async (photo: IPhoto) => {
        this.loading = true;

        try {
            await agent.Profiles.setMainPhoto(photo.id);
            runInAction('set main photo', () => {
                this.rootStore.userStore.user!.image = photo.url;
                this.profile!.photos.find(a => a.isMain)!.isMain = false;
                this.profile!.photos.find(a => a.id === photo.id)!.isMain = true;
                this.profile!.image = photo.url;
                this.loading = false; 
            })
        } catch (error) {
            toast.error('Problem setting photo as main');
            runInAction('error setting main photo', () => {
                this.loading = false;
            })
        }
    }

    @action deletePhoto = async (photo: IPhoto) => {
        this.loading = true;
        try {
            await agent.Profiles.deletePhoto(photo.id);
            runInAction('deleting photo', () => {
                this.profile!.photos = this.profile!.photos.filter(a => a.id !== photo.id);
                this.loading = false;
            })
        } catch (error) {
            toast.error("Problem deleting the photo");

            runInAction('error deleting photo', () => {
                this.loading = false;
            })
            
        }
    }

    @action updateBio = async (values: IProfileFormValues) => {
        this.updatingBio = true;
        try {
            this.profile!.displayName = values.displayName;
            this.profile!.bio = values.bio;

            await agent.Profiles.updateBio(this.profile!);
            runInAction('update bio', () => {
                this.updatingBio = false;
            });            
        } catch (error) {
            toast.error("Problem updating bio");

            runInAction('error updating bio', () => {
                this.updatingBio = false;
            });
        }
    }
}