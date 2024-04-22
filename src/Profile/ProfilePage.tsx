// ProfileManagement.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// Types
type Profile = {
    name: string;
    bio: string;
    email: string;
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
        <div className="grid grid-cols-1 gap-1 p-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">{label}</dt>
            <dd className="text-gray-700 sm:col-span-2">
                {editing ? (
                    inputType === 'textarea' ? (
                        <textarea
                            value={value}
                            onChange={onChange}
                            className="form-input w-full rounded-md"
                            rows={3}
                        />
                    ) : (
                        <input
                            type={inputType}
                            value={value}
                            onChange={onChange}
                            className="form-input w-full rounded-md"
                        />
                    )
                ) : (
                    value
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
        <form onSubmit={handleSubmit} className="flow-root rounded-lg border border-gray-100 py-3 shadow-sm">
            <ProfileField label="Name" value={formData.name} editing={true} onChange={handleInputChange('name')} />
            <ProfileField label="Bio" value={formData.bio} editing={true} onChange={handleInputChange('bio')} inputType="textarea" />
            <ProfileField label="Email" value={formData.email} editing={true} onChange={handleInputChange('email')} inputType="email" />
            <div className="flex justify-end p-3">
                <button type="button" onClick={onCancel} className="btn mr-2">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
            </div>
        </form>
    );
};

// UserInfo Component
const UserInfo: React.FC<UserInfoProps> = ({ profile, onEdit }) => (
    <div className="flow-root rounded-lg border border-gray-100 py-3 shadow-sm">
        <ProfileField label="Name" value={profile.name} editing={false} />
        <ProfileField label="Bio" value={profile.bio} editing={false} />
        <ProfileField label="Email" value={profile.email} editing={false} />
        <div className="flex justify-end p-3">
            <button onClick={onEdit} className="btn btn-primary">Edit</button>
        </div>
    </div>
);

// ProfilePage Component
const ProfilePage: React.FC<{ isLoggedIn: boolean }> = ({ isLoggedIn }) => {
    const { profileId } = useParams<string>();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get<Profile>(`/api/profile/${profileId || 'me'}`);
                setProfile(response.data);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };
        fetchProfile();
    }, [profileId]);

    const handleSave = (updatedProfile: Profile) => {
        axios.put(`/api/profile/${profileId || 'me'}`, updatedProfile)
            .then((response) => {
                setProfile(response.data);
                setEditing(false);
            })
            .catch((error) => console.error('Error updating profile:', error));
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
