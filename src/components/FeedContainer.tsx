import { useState, useEffect } from 'react';
import { IonApp, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonInput, IonLabel, IonModal, IonFooter, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonAlert, IonText, IonAvatar, IonCol, IonGrid, IonRow, IonIcon, IonPopover } from '@ionic/react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../utils/supabaseClient';
import { colorFill, pencil, trash } from 'ionicons/icons';

interface Post {
  post_id: string;
  user_id: number;
  username: string;
  avatar_url: string;
  post_content: string;
  post_created_at: string;
  post_updated_at: string;
}

const FeedContainer = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [postContent, setPostContent] = useState('');
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [popoverState, setPopoverState] = useState<{ open: boolean; event: Event | null; postId: string | null }>({ open: false, event: null, postId: null });

  useEffect(() => {
    const fetchUser = async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user?.email?.endsWith('@nbsc.edu.ph')) {
        setUser(authData.user);
        const { data: userData, error } = await supabase
          .from('users')
          .select('user_id, username, user_avatar_url')
          .eq('user_email', authData.user.email)
          .single();
        if (!error && userData) {
          setUser({ ...authData.user, id: userData.user_id });
          setUsername(userData.username);
        }
      }
    };
    const fetchPosts = async () => {
      const { data, error } = await supabase.from('posts').select('*').order('post_created_at', { ascending: false });
      if (!error) setPosts(data as Post[]);
    };
    fetchUser();
    fetchPosts();
  }, []);

  const createPost = async () => {
    if (!postContent || !user || !username) return;
  
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('user_avatar_url')
      .eq('user_id', user.id)
      .single();
  
    if (userError) {
      console.error('Error fetching user avatar:', userError);
      return;
    }
  
    const avatarUrl = userData?.user_avatar_url || 'https://ionicframework.com/docs/img/demos/avatar.svg';
  
    const { data, error } = await supabase
      .from('posts')
      .insert([{ post_content: postContent, user_id: user.id, username, avatar_url: avatarUrl }])
      .select('*');
  
    if (!error && data) {
      setPosts([data[0] as Post, ...posts]);
    }
  
    setPostContent('');
  };

  const deletePost = async (post_id: string) => {
    await supabase.from('posts').delete().match({ post_id });
    setPosts(posts.filter(post => post.post_id !== post_id));
  };

  const startEditingPost = (post: Post) => {
    setEditingPost(post);
    setPostContent(post.post_content);
    setIsModalOpen(true);
  };

  const savePost = async () => {
    if (!postContent || !editingPost) return;
    const { data, error } = await supabase
      .from('posts')
      .update({ post_content: postContent })
      .match({ post_id: editingPost.post_id })
      .select('*');
    if (!error && data) {
      const updatedPost = data[0] as Post;
      setPosts(posts.map(post => (post.post_id === updatedPost.post_id ? updatedPost : post)));
      setPostContent('');
      setEditingPost(null);
      setIsModalOpen(false);
      setIsAlertOpen(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="dark">
          <IonTitle style={{ color: '#00FFFF' }}>Feed</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent style={{ backgroundColor: '#121212' }}>
        {user ? (
          <>
            <IonCard style={{ backgroundColor: '#333' }}>
              <IonCardHeader style={{ backgroundColor: '#222' }}>
                <IonCardTitle style={{ color: '#00FFFF' }}>Create Post</IonCardTitle>
              </IonCardHeader>
              <IonCardContent style={{ backgroundColor: '#333' }}>
                <IonInput 
                  value={postContent} 
                  onIonChange={e => setPostContent(e.detail.value!)} 
                  placeholder="Write a post..." 
                  style={{ color: '#fff', backgroundColor: '#444', border: 'none' }}
                />
              </IonCardContent>
              <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0.5rem' }}>
                <IonButton style={{ backgroundColor: '#00FFFF', color: '#121212' }} onClick={createPost}>Post</IonButton>
              </div>
            </IonCard>

            {posts.map(post => (
              <IonCard key={post.post_id} style={{ marginTop: '2rem', backgroundColor: '#333', color: '#fff' }}>
                <IonCardHeader style={{ backgroundColor: '#222' }}>
                  <IonRow>
                    <IonCol size="1.85">
                      <IonAvatar>
                        <img alt={post.username} src={post.avatar_url} />
                      </IonAvatar>
                    </IonCol>
                    <IonCol>
                      <IonCardTitle style={{ color: '#00FFFF' }}>{post.username}</IonCardTitle>
                      <IonCardSubtitle style={{ color: '#aaa' }}>
                        {new Date(post.post_created_at).toLocaleString()}
                      </IonCardSubtitle>
                    </IonCol>
                    <IonCol size="auto">
                      <IonButton
                        fill="clear"
                        onClick={(e) => setPopoverState({ open: true, event: e.nativeEvent, postId: post.post_id })}
                        style={{ color: '#00FFFF' }}
                      >
                        <IonIcon color="secondary" icon={pencil} />
                      </IonButton>
                    </IonCol>
                  </IonRow>
                </IonCardHeader>
                <IonCardContent>
                  <IonText style={{ color: '#fff' }}>
                    <h1>{post.post_content}</h1>
                  </IonText>
                </IonCardContent>

                <IonPopover
                  isOpen={popoverState.open && popoverState.postId === post.post_id}
                  event={popoverState.event}
                  onDidDismiss={() => setPopoverState({ open: false, event: null, postId: null })}
                >
                  <IonButton fill="clear" onClick={() => { startEditingPost(post); setPopoverState({ open: false, event: null, postId: null }); }} style={{ color: '#00FFFF' }}>
                    Edit
                  </IonButton>
                  <IonButton fill="clear" color="danger" onClick={() => { deletePost(post.post_id); setPopoverState({ open: false, event: null, postId: null }); }} style={{ color: '#FF6347' }}>
                    Delete
                  </IonButton>
                </IonPopover>
              </IonCard>
            ))}
          </>
        ) : (
          <IonLabel style={{ color: '#00FFFF' }}>Loading...</IonLabel>
        )}
      </IonContent>

      <IonModal isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)}>
        <IonHeader>
          <IonToolbar color="dark">
            <IonTitle style={{ color: '#00FFFF' }}>Edit Post</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent style={{ backgroundColor: '#121212' }}>
          <IonInput
            value={postContent}
            onIonChange={e => setPostContent(e.detail.value!)}
            placeholder="Edit your post..."
            style={{ color: '#fff', backgroundColor: '#444', border: 'none' }}
          />
        </IonContent>
        <IonFooter style={{ backgroundColor: '#222' }}>
          <IonButton style={{ backgroundColor: '#00FFFF', color: '#121212' }} onClick={savePost}>Save</IonButton>
          <IonButton style={{ backgroundColor: '#FF6347', color: '#fff' }} onClick={() => setIsModalOpen(false)}>Cancel</IonButton>
        </IonFooter>
      </IonModal>

      <IonAlert
        isOpen={isAlertOpen}
        onDidDismiss={() => setIsAlertOpen(false)}
        header="Success"
        message="Post updated successfully!"
        buttons={['OK']}
      />
    </IonPage>
  );
};

export default FeedContainer;
