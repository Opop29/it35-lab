import {
    IonAlert,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonMenu,
    IonMenuButton,
    IonMenuToggle,
    IonPage,
    IonRouterOutlet,
    IonSplitPane,
    IonTitle,
    IonToast,
    IonToolbar,
    useIonRouter
  } from '@ionic/react';
  import {
    homeOutline,
    logOutOutline,
    rocketOutline,
    settingsOutline
  } from 'ionicons/icons';
  import { Redirect, Route } from 'react-router';
  import Home from './Home';
  import About from './About';
  import Details from './Details';
  import { supabase } from '../utils/supabaseClient';
  import { useState } from 'react';
  import EditProfilePage from './EditProfile';
  
  const Menu: React.FC = () => {
    const navigation = useIonRouter();
    const [showAlert, setShowAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
  
    const path = [
      { name: 'Home', url: '/it35-lab/app/home', icon: homeOutline },
      { name: 'About', url: '/it35-lab/app/about', icon: rocketOutline },
      { name: 'Profile', url: '/it35-lab/app/profile', icon: settingsOutline }
    ];
  
    const handleLogout = async () => {
      const { error } = await supabase.auth.signOut();
      if (!error) {
        setShowToast(true);
        setTimeout(() => {
          navigation.push('/it35-lab', 'back', 'replace');
        }, 300);
      } else {
        setErrorMessage(error.message);
        setShowAlert(true);
      }
    };
  
    return (
      <IonPage>
        <IonSplitPane contentId="main">
          <IonMenu contentId="main">
            <IonHeader>
              <IonToolbar style={{ backgroundColor: '#000' }}>
                <IonTitle style={{ color: '#00ffff', fontWeight: 'bold' }}>
                  Menu
                </IonTitle>
              </IonToolbar>
            </IonHeader>
            <IonContent style={{ backgroundColor: '#101010', color: 'white' }}>
              {path.map((item, index) => (
                <IonMenuToggle key={index}>
                  <IonItem
                    routerLink={item.url}
                    routerDirection="forward"
                    style={{
                      color: 'white',
                      background: 'transparent',
                      transition: '0.3s',
                      borderLeft: '4px solid transparent'
                    }}
                    onMouseEnter={(e: any) => {
                      e.currentTarget.style.backgroundColor = '#00ffff20';
                      e.currentTarget.style.color = '#00ffff';
                      e.currentTarget.style.borderLeft = '4px solid #00ffff';
                    }}
                    onMouseLeave={(e: any) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.borderLeft = '4px solid transparent';
                    }}
                  >
                    <IonIcon
                      icon={item.icon}
                      slot="start"
                      style={{ color: '#00ffff' }}
                    />
                    {item.name}
                  </IonItem>
                </IonMenuToggle>
              ))}
  
              <IonButton
                expand="full"
                onClick={handleLogout}
                style={{
                  marginTop: '1rem',
                  '--background': '#00ffff',
                  '--color': '#000',
                  fontWeight: 'bold',
                  transition: '0.3s'
                }}
                onMouseEnter={(e: any) => {
                  e.currentTarget.style.opacity = '0.85';
                }}
                onMouseLeave={(e: any) => {
                  e.currentTarget.style.opacity = '1';
                }}
              >
                <IonIcon icon={logOutOutline} slot="start" />
                Logout
              </IonButton>
            </IonContent>
          </IonMenu>
          
  <IonRouterOutlet id="main">
  <div style={{ marginTop: '50px' }}>
    <Route exact path="/it35-lab/app/home" component={Home} />
    <Route exact path="/it35-lab/app/home/details" component={Details} />
    <Route exact path="/it35-lab/app/about" component={About} />
    <Route exact path="/it35-lab/app/profile" component={EditProfilePage} />
    <Route exact path="/it35-lab/app">
      <Redirect to="/it35-lab/app/home" />
    </Route>
    </div>
  </IonRouterOutlet>


  
          <IonAlert
            isOpen={showAlert}
            onDidDismiss={() => setShowAlert(false)}
            header="Logout Failed"
            message={errorMessage}
            buttons={['OK']}
          />
  
          <IonToast
            isOpen={showToast}
            onDidDismiss={() => setShowToast(false)}
            message="Logout Successful"
            duration={1500}
            position="top"
            color="primary"
          />
        </IonSplitPane>
      </IonPage>
    );
  };
  
  export default Menu;
  