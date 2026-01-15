import * as React from "react";

interface EmailTemplateProps {
  username: string;
  otp: string;
}

export function EmailTemplate({ username, otp }: EmailTemplateProps) {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f4f6f8",
        padding: "30px",
      }}
    >
      <div
        style={{
          maxWidth: "500px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          padding: "25px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <h2 style={{ color: "#333" }}>Email Verification</h2>

        <p style={{ color: "#555", fontSize: "15px" }}>
          Hi <strong>{username}</strong>,
        </p>

        <p style={{ color: "#555", fontSize: "15px" }}>
          Thank you for signing up. Please use the following One-Time Password
          (OTP) to verify your email address:
        </p>

        <div
          style={{
            margin: "20px 0",
            padding: "15px",
            backgroundColor: "#f0f4ff",
            textAlign: "center",
            fontSize: "24px",
            letterSpacing: "6px",
            fontWeight: "bold",
            color: "#2b5cff",
            borderRadius: "6px",
          }}
        >
          {otp}
        </div>

        <p style={{ color: "#555", fontSize: "14px" }}>
          This OTP is valid for the next <strong>10 minutes</strong>.  
          Please do not share it with anyone.
        </p>

        <p style={{ color: "#777", fontSize: "13px", marginTop: "20px" }}>
          If you did not request this, please ignore this email.
        </p>

        <p style={{ color: "#333", fontSize: "14px", marginTop: "25px" }}>
          Regards, <br />
          <strong>Your Team</strong>
        </p>
      </div>
    </div>
  );
}
