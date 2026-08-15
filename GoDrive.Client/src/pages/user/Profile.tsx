import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useGetMyProfileQuery, useUpdateMyProfileMutation } from "../../redux/features/users/usersApi";
import { getErrorMessage } from "../../utils/getErrorMessage";

export default function Profile() {
  const { data: profile, isLoading } = useGetMyProfileQuery();
  const [updateProfile, { isLoading: isSaving, error, isSuccess }] = useUpdateMyProfileMutation();

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [nidOrPassportNumber, setNidOrPassportNumber] = useState("");
  const [drivingLicenseNumber, setDrivingLicenseNumber] = useState("");

  useEffect(() => {
    if (!profile) return;
    setFullName(profile.fullName);
    setPhoneNumber(profile.phoneNumber ?? "");
    setAddress(profile.address ?? "");
    setNidOrPassportNumber(profile.nidOrPassportNumber ?? "");
    setDrivingLicenseNumber(profile.drivingLicenseNumber ?? "");
  }, [profile]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    updateProfile({
      fullName,
      phoneNumber: phoneNumber || undefined,
      address: address || undefined,
      nidOrPassportNumber: nidOrPassportNumber || undefined,
      drivingLicenseNumber: drivingLicenseNumber || undefined,
    });
  };

  if (isLoading) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="auth-form">
      <h1>My Profile</h1>
      <p>
        A National ID/Passport number and Driving License number are required before you can book a car.
      </p>

      <form onSubmit={handleSubmit}>
        <label>
          Full name
          <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </label>
        <label>
          Phone number
          <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        </label>
        <label>
          Address
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
        </label>
        <label>
          NID / Passport number
          <input
            type="text"
            value={nidOrPassportNumber}
            onChange={(e) => setNidOrPassportNumber(e.target.value)}
          />
        </label>
        <label>
          Driving license number
          <input
            type="text"
            value={drivingLicenseNumber}
            onChange={(e) => setDrivingLicenseNumber(e.target.value)}
          />
        </label>

        {error && <p className="form-error">{getErrorMessage(error)}</p>}
        {isSuccess && <p>Profile saved.</p>}

        <button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}
