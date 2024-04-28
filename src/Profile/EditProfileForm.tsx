import React, { useState } from 'react';
import supabase from '../supabaseClient';
import ProfileField from './ProfileField';

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

type EditProfileFormProps = {
    profile: Profile;
    onCancel: () => void;
    onSave: (data: Profile) => void;
};

const EditProfileForm: React.FC<EditProfileFormProps> = ({ profile, onCancel, onSave }) => {
    const [formData, setFormData] = useState<Profile>(profile);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (field: keyof Profile) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [field]: event.target.value });
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            await uploadFile(event.target.files[0]);
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onSave(formData);
    };

    const uploadFile = async (file: File) => {
        const timestamp = new Date().getTime();
        const fileExtension = file.name.split('.').pop();
        if (fileExtension !== "jpg" && fileExtension !== "png") {
          setError("Only JPEG and PNG files are allowed.");
          return;
      }
        const fileName = `${timestamp}.${fileExtension}`;
        const filePath = `profile_pictures/${fileName}`;
        
      
        const { data, error } = await supabase.storage.from('profile').upload(filePath, file);
        if (error) {
            console.error('Error uploading file:', error);
        } else {
            console.log('File uploaded successfully');
            const { data: urlData} = supabase.storage.from('profile').getPublicUrl(filePath);    
            setFormData({ ...formData, profileURL: urlData.publicUrl });
            onSave({ ...formData, profileURL: urlData.publicUrl });
            console.log('File URL:', urlData.publicUrl);
        } 
      };

      return (
        <form onSubmit={handleSubmit} className="flow-root rounded-lg border border-gray-100 py-3 shadow-sm">
            <label>Profile Picture</label>
                <input type="file" onChange={handleFileChange} />
                {error && <p className="error">{error}</p>}
            <ProfileField label="First Name" value={formData.first_name} editing={true} onChange={handleInputChange('first_name')} />
            <ProfileField label="Last Name" value={formData.last_name} editing={true} onChange={handleInputChange('last_name')} />
            <ProfileField label="Username" value={formData.username} editing={true} onChange={handleInputChange('username')} />
            <ProfileField label="Email" value={formData.email} editing={true} onChange={handleInputChange('email')} inputType="email" />
            <ProfileField label="Role" value={profile.role} editing={false} />
            <div className="flex justify-end p-3">
                <button type="button" onClick={onCancel} className="btn mr-2">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
            </div>
        </form>
    );
};

export default EditProfileForm;