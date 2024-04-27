import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import supabase from '../supabaseClient';

type Profile = {
    first_name: string;
    last_name: string;
    email: string;
    username: string;
};

type UserInfoProps = {
  profile: Profile;
};

type ProfileFieldProps = {
    label: string;
    value: string;
};

const ProfileField: React.FC<ProfileFieldProps> = ({
    label,
    value,
}) => {
    return (
        <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">{label}</dt>
            <dd className="text-gray-700 sm:col-span-2">
                {
                    value
                }
            </dd>
        </div>
    );
};


const UserInfo: React.FC<UserInfoProps> = ({ profile }) => {
  return (
    <div className="flow-root rounded-lg border border-gray-100 py-3 shadow-sm">
        <ProfileField label="First Name" value={profile.first_name} />
        <ProfileField label="Last Name" value={profile.last_name}/>
        <ProfileField label="Username" value={profile.username}/>
        <ProfileField label="Email" value={profile.email}/>
    </div>
  );
};

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

  return <UserInfo profile={profile} />;
};

export default UserPage;