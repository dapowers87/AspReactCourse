import React, { useContext, useState } from "react";
import { RootStoreContext } from "../../app/stores/rootStore";
import { Header, Button, Tab, Grid } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import ProfileEditForm from "./ProfileEditForm";

const ProfileDescription = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    profile,
    isCurrentUser
  } = rootStore.profileStore;

  const [editBioMode, setEditBioMode] = useState(false)

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16} style={{ paddingBottom: 0 }}>
          <Header floated="left" icon="user" content={`About ${profile && profile.displayName}`} />
          {isCurrentUser && (
            <Button
              floated="right"
              basic
              content={editBioMode ? "Cancel" : "Edit Profile"}
              onClick = {() => { setEditBioMode(!editBioMode); }}
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>{editBioMode ? <ProfileEditForm setEditBioMode = {setEditBioMode} /> : profile && profile.bio}</Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default observer(ProfileDescription);
