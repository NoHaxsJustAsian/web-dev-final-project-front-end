// ProfileManagement.tsx
import React, { useState, useEffect } from 'react';
import supabase from '../supabaseClient'; // Import Supabase client

// Types
type Profile = {
    first_name: string;
    last_name: string;
    email: string;
    username: string;
};

type ProfileFieldProps = {
    label: string;
    value: string;
    editing: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    inputType?: string;
};

type EditProfileFormProps = {
    profile: Profile;
    onCancel: () => void;
    onSave: (data: Profile) => void;
};

type UserInfoProps = {
    profile: Profile;
    onEdit: () => void;
};

// ProfileField Component
const ProfileField: React.FC<ProfileFieldProps> = ({
    label,
    value,
    editing,
    onChange,
    inputType = 'text'
}) => {
    return (
        <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">{label}</dt>
            <dd className="text-gray-700 sm:col-span-2">
                {editing ? (
                    <input
                        type={inputType}
                        value={value}
                        onChange={onChange}
                        className="form-input w-full rounded-md border border-gray-300 px-4 py-2"
                    />
                ) : (
                    <span className="block py-2 text-left">{value}</span>
                )}
            </dd>
        </div>
    );
};


// EditProfileForm Component
const EditProfileForm: React.FC<EditProfileFormProps> = ({ profile, onCancel, onSave }) => {
    const [formData, setFormData] = useState<Profile>(profile);

    const handleInputChange = (field: keyof Profile) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [field]: event.target.value });
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onSave(formData);
    };
    return (
        <div className="my-4 rounded-lg border border-gray-100 bg-white p-6 shadow">
            <form onSubmit={handleSubmit} className="space-y-4">
                <ProfileField label="First Name" value={formData.first_name} editing={true} onChange={handleInputChange('first_name')} />
                <ProfileField label="Last Name" value={formData.last_name} editing={true} onChange={handleInputChange('last_name')} />
                <ProfileField label="Username" value={formData.username} editing={true} onChange={handleInputChange('username')} />
                <ProfileField label="Email" value={formData.email} editing={true} onChange={handleInputChange('email')} inputType="email" />
                <div className="flex justify-end space-x-2">
                    <button type="button" onClick={onCancel} className="rounded bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300">
                        Cancel
                    </button>
                    <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

// UserInfo Component
const UserInfo: React.FC<UserInfoProps> = ({ profile, onEdit }) => (
    <div className="my-4 rounded-lg border border-gray-100 bg-white p-6 shadow">
        <ProfileField label="First Name" value={profile.first_name} editing={false} />
        <ProfileField label="Last Name" value={profile.last_name} editing={false} />
        <ProfileField label="Username" value={profile.username} editing={false} />
        <ProfileField label="Email" value={profile.email} editing={false} />
        <div className="flex justify-end p-3">
            <button onClick={onEdit} className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                Edit
            </button>
        </div>
    </div>

);

// ProfilePage Component
const ProfilePage: React.FC<{ isLoggedIn: boolean }> = ({ isLoggedIn }) => {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data, error } = await supabase
                    .from('users')
                    .select('*')
                    .single();

                if (error) {
                    throw error;
                }

                setProfile(data);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async (updatedProfile: Profile) => {
        try {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (user) {
                const { data, error } = await supabase
                    .from('users')
                    .update(updatedProfile)
                    .match({ id: user.id });
                setProfile(updatedProfile);
            } else {
                console.error("No user found");
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
        setEditing(false);
    };

    return (
        <div>
            <h1 className="text-2xl font-semibold text-gray-900 p-4">Profile</h1>
            {profile && (editing ? (
                <EditProfileForm profile={profile} onCancel={() => setEditing(false)} onSave={handleSave} />
            ) : (
                <UserInfo profile={profile} onEdit={() => setEditing(true)} />
            ))}
        </div>
    );
};

export default ProfilePage;