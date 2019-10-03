import React, { useContext } from "react";
import { Form as FinalForm, Field } from "react-final-form";
import { IProfileFormValues } from "../../app/models/profile";
import { RootStoreContext } from "../../app/stores/rootStore";
import { FORM_ERROR } from "final-form";
import { Form, Button } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import TextAreaInput from "../../app/common/form/TextAreaInput";
import TextInput from "../../app/common/form/TextInput";
import { combineValidators, isRequired } from "revalidate";

interface IProps {
    setEditBioMode: (editMode: boolean) => void;
}

const ProfileEditForm: React.FC<IProps> = ({setEditBioMode}) => {
  const rootStore = useContext(RootStoreContext);
  const { updateBio, profile, updatingBio } = rootStore.profileStore;

  const validate = combineValidators({
    displayName: isRequired({ message: "A display name is required" })
  });
  return (
    <FinalForm
      validate={validate}
      onSubmit={(values: IProfileFormValues) =>
        updateBio(values).catch(error => ({ [FORM_ERROR]: error })).finally(() => { setEditBioMode(false) })
      }
      initialValues={profile!}
      render={({handleSubmit, invalid, pristine}) => (
        <Form onSubmit={handleSubmit}>
          <Field
            name="displayName"
            component={TextInput}
            placeholder="Display Name"
            value={profile!.displayName}
          />
          <Field
            name="bio"
            component={TextAreaInput}
            placeholder="Bio"
            value={profile!.bio}
          />
          <Button
            loading={updatingBio}
            floated="right"
            positive
            type="submit"
            content="Update Profile"
            disabled={invalid || pristine}
          />
        </Form>
      )}
    />
  );
};

export default observer(ProfileEditForm);
