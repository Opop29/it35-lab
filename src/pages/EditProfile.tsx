import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonButtons, IonBackButton, IonContent,
  IonItem, IonText, IonGrid, IonRow, IonCol, IonInput, IonButton,
  IonAlert, IonAvatar, IonImg, IonInputPasswordToggle
} from '@ionic/react';
import { supabase } from '../utils/supabaseClient';

const EditAccount: React.FC = () => {
  const [username, setUsername] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  // Handle file input for avatar upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(`avatars/${file.name}`, file);

      if (error) {
        console.error(error);
        setAlertMessage('Failed to upload avatar.');
        setShowAlert(true);
      } else {
        const { publicURL } = supabase.storage.from('avatars').getPublicUrl(data.path);
        setAvatarUrl(publicURL);
      }
    }
  };

  // Update account info in the Supabase database
  const updateAccount = async () => {
    if (newPassword !== confirmPassword) {
      setAlertMessage('Passwords do not match.');
      setShowAlert(true);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          username,
          user_firstname: firstname,
          user_lastname: lastname,
          user_avatar_url: avatarUrl,
          password: newPassword ? newPassword : undefined,
        })
        .eq('user_id', '1'); // Use the user's actual ID here (hardcoded as '1' for now)

      if (error) {
        throw error;
      }

      setAlertMessage('Account updated successfully!');
      setShowAlert(true);
    } catch (error) {
      console.error(error);
      setAlertMessage('Failed to update account.');
      setShowAlert(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonButtons slot="start">
          <IonBackButton defaultHref="/it35-lab/app" />
        </IonButtons>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* Title */}
        <IonItem>
          <IonText color="secondary">
            <h1>Edit Account</h1>
          </IonText>
        </IonItem>

        {/* Avatar Upload */}
        <IonGrid>
          <IonRow className="ion-justify-content-center ion-align-items-center">
            <IonCol className="ion-text-center">
              <IonAvatar>
                <IonImg src={avatarUrl} />
              </IonAvatar>
              <input
                type="file"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <IonButton expand="block" onClick={() => document.querySelector('input[type="file"]')?.click()}>
                Upload Avatar
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* Account Info Fields */}
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonInput
                label="Username"
                type="text"
                value={username}
                onIonChange={(e) => setUsername(e.detail.value!)}
                fill="outline"
              />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="6">
              <IonInput
                label="First Name"
                type="text"
                value={firstname}
                onIonChange={(e) => setFirstname(e.detail.value!)}
                fill="outline"
              />
            </IonCol>
            <IonCol size="6">
              <IonInput
                label="Last Name"
                type="text"
                value={lastname}
                onIonChange={(e) => setLastname(e.detail.value!)}
                fill="outline"
              />
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* Change Password */}
        <IonGrid>
          <IonRow>
            <IonText color="secondary"><h3>Change Password</h3></IonText>
            <IonCol size="12">
              <IonInput
                label="New Password"
                type="password"
                value={newPassword}
                onIonChange={(e) => setNewPassword(e.detail.value!)}
                fill="outline"
              >
                <IonInputPasswordToggle slot="end" />
              </IonInput>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="12">
              <IonInput
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onIonChange={(e) => setConfirmPassword(e.detail.value!)}
                fill="outline"
              >
                <IonInputPasswordToggle slot="end" />
              </IonInput>
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* Current Password for Confirmation */}
        <IonGrid>
          <IonRow>
            <IonText color="secondary"><h3>Confirm Changes</h3></IonText>
            <IonCol size="12">
              <IonInput
                label="Current Password"
                type="password"
                value={currentPassword}
                onIonChange={(e) => setCurrentPassword(e.detail.value!)}
                fill="outline"
              >
                <IonInputPasswordToggle slot="end" />
              </IonInput>
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* Submit Button */}
        <IonButton expand="full" shape="round" onClick={updateAccount}>
          Update Account
        </IonButton>

        {/* Alert */}
        <IonAlert
          isOpen={showAlert}
          message={alertMessage}
          buttons={['OK']}
          onDidDismiss={() => setShowAlert(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default EditAccount;
