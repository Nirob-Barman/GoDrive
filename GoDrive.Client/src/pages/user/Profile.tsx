import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useGetMyProfileQuery, useUpdateMyProfileMutation } from "../../redux/features/users/usersApi";
import {
  useChangePasswordMutation,
  useLogoutMutation,
  useRevokeAllTokensMutation,
} from "../../redux/features/auth/authApi";
import { useAppDispatch } from "../../redux/hooks";
import { logout } from "../../redux/features/auth/authSlice";
import { getErrorMessage } from "../../utils/getErrorMessage";

function ChangePasswordSection() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [changePassword, { isLoading, error, data: message }] = useChangePasswordMutation();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const result = await changePassword({ currentPassword, newPassword, confirmNewPassword })
      .unwrap()
      .catch(() => null);

    if (result) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    }
  };

  return (
    <div className="auth-form">
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Current password
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </label>
        <label>
          New password
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
        </label>
        <label>
          Confirm new password
          <input
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
          />
        </label>

        {error && <p className="form-error">{getErrorMessage(error)}</p>}
        {message && <p>{message}</p>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Changing..." : "Change Password"}
        </button>
      </form>
    </div>
  );
}

function LogOutEverywhereSection() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [revokeAllTokens, { isLoading }] = useRevokeAllTokensMutation();
  const [logoutRequest] = useLogoutMutation();

  const handleClick = async () => {
    // Revokes every active refresh token for this account, including this browser's own -
    // treat it exactly like a local logout too, not just a background session cleanup.
    await revokeAllTokens().unwrap().catch(() => null);
    await logoutRequest().catch(() => undefined);
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <div className="auth-form">
      <h2>Sessions</h2>
      <p>Log out of every device where you're currently signed in, including this one.</p>
      <button type="button" onClick={handleClick} disabled={isLoading}>
        {isLoading ? "Logging out everywhere..." : "Log Out Everywhere"}
      </button>
    </div>
  );
}

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
    <>
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

      <ChangePasswordSection />
      <LogOutEverywhereSection />
    </>
  );
}
