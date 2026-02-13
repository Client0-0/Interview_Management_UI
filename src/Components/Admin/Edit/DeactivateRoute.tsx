import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserDeactivateModal from "./UserDeactivateModal";
import { getUserById } from "../../../Services/User.Service";
import type { Users } from "../../../Models/user";

const DeactivateUserRoute = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState<Users | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const loadUser = async () => {
      try {
        const res = await getUserById(Number(userId));
        setUser(res.data.data);
      } catch {
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [userId, navigate]);

  if (!user) return null;

  return (
    <UserDeactivateModal
      isOpen
      user={user}
      loading={loading}
      onClose={() => { navigate(-1) }}
    />
  );
};

export default DeactivateUserRoute;
