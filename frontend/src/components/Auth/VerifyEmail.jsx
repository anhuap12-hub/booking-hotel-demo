import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyEmail } from "../../api/auth.api";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("invalid");
      return;
    }

    let timer;

    verifyEmail(token)
      .get(`/auth/verify-email?token=${token}`)
      .then(() => {
        setStatus("success");
        timer = setTimeout(() => {
          navigate("/login", { replace: true });
        }, 2500);
      })
      .catch(() => {
        setStatus("error");
      });

    return () => timer && clearTimeout(timer);
  }, [navigate, searchParams]);

  if (status === "loading") return <p>⏳ Verifying...</p>;
  if (status === "success")
    return <p>✅ Email verified! Redirecting to login...</p>;
  if (status === "invalid") return <p>❌ Invalid token</p>;
  return <p>❌ Verify failed or expired</p>;
}
