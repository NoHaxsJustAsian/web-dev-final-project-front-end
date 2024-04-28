import React from 'react';

type ProfileFieldProps = {
    label: string;
    value: string;
    editing: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    inputType?: string;
};

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

export default ProfileField;