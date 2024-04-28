
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import supabase from '../supabaseClient';
import ReviewList from '../Review/ReviewList';

type Profile = {
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    role: string;
    reviews: string[];
    selling_posts: string[];
    profileURL: string;
};

type UserInfoProps = {
  profile: Profile;
};

const UserInfo: React.FC<UserInfoProps> = ({ profile }) => (
    <article className="flow-root rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-lg sm:p-6 max-w-md mx-auto sm:mx-4">
      <h1 className="text-2xl font-bold">Profile</h1>
        <img src={profile.profileURL} className="h-40 w-40 rounded-full" />
        <div className="flex items-center space-x-4">
            <div>
                <h2 className="text-lg leading-6 font-medium text-gray-900">{`${profile.first_name} ${profile.last_name}`}</h2>
                <p className="mt-1 text-sm font-medium text-green-500">@{profile.username}</p>
                <p className="mt-1 text-sm text-pretty text-gray-500">{profile.role}</p>
            </div>
        </div>
    </article>
);

const UserPage: React.FC = () => {
  const { username } = useParams<{ username: string }>();

  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();
      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        setProfile(data);
      }
    };

    fetchProfile();
  }, [username]);

  if (!profile) {
    return <div>404 Profile Not Found</div>;
  }

  return (
  <div>
    <UserInfo profile={profile} />
    <ReviewList reviewIds={profile.reviews} />
  </div>
)
};

export default UserPage;
