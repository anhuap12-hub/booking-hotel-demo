import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import EmailVerifyToken from "../models/EmailVerifyToken.js";
import { sendVerifyEmail } from "../utils/sendVerifyEmail.js";

/**
 * Helper: lấy URL frontend (KHÔNG đoán LAN IP)
 */
const getFrontendUrl = () => {
  return process.env.CLIENT_URL || "http://localhost:5173";
};

/**
 * REGISTER - Đăng ký tài khoản
 */
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
    }

    const existingUser = await User.findOne({ email });

    // 1. Kiểm tra tồn tại
    if (existingUser && existingUser.emailVerified) {
      return res.status(400).json({ message: "Email này đã được sử dụng" });
    }

    let user = existingUser;

    if (existingUser && !existingUser.emailVerified) {
      await EmailVerifyToken.deleteMany({ user: existingUser._id });
    } else {
      user = await User.create({
        username,
        email,
        password,
        emailVerified: false,
      });
    }

    // 2. Tạo Token xác thực
    const token = crypto.randomBytes(32).toString("hex");
    await EmailVerifyToken.create({
      user: user._id,
      token,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), 
    });

    const verifyLink = `${process.env.SERVER_URL}/api/auth/verify-email?token=${encodeURIComponent(token)}`;

    // --- THAY ĐỔI QUAN TRỌNG TẠI ĐÂY ---
    // Không dùng 'await' cho sendVerifyEmail để tránh việc gửi mail chậm/lỗi làm treo request đăng ký.
    // Chúng ta trả về phản hồi 201 ngay lập tức cho khách hàng.
    sendVerifyEmail(user.email, verifyLink).catch((err) => {
      console.error("❌ SEND VERIFY EMAIL ERROR (Background):", err.message);
      // Bạn có thể log vào hệ thống giám sát ở đây, nhưng không chặn User
    });

    return res.status(201).json({
      success: true,
      message: "Đăng ký thành công. Vui lòng kiểm tra Email để xác thực tài khoản.",
    });
    // ----------------------------------

  } catch (error) {
    console.error("🔥 REGISTER ERROR:", error);
    return res.status(500).json({ message: "Lỗi hệ thống khi đăng ký" });
  }
};

/**
 * VERIFY EMAIL - Xác thực qua link
 */
export const verifyEmail = async (req, res) => {
  const frontendUrl = getFrontendUrl();

  try {
    const { token } = req.query;

    if (!token) {
      return res.redirect(`${frontendUrl}/verify-failed`);
    }

    const record = await EmailVerifyToken.findOne({ token });
    if (!record || record.expiresAt < Date.now()) {
      return res.redirect(`${frontendUrl}/verify-failed`);
    }

    const user = await User.findById(record.user);
    if (!user) {
      return res.redirect(`${frontendUrl}/verify-failed`);
    }

    user.emailVerified = true;
    await user.save();

    await EmailVerifyToken.deleteMany({ user: user._id });

    return res.redirect(`${frontendUrl}/verify-success`);
  } catch (error) {
    console.error("🔥 VERIFY EMAIL ERROR:", error);
    return res.redirect(`${frontendUrl}/verify-failed`);
  }
};

/**
 * LOGIN - Đăng nhập
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: "Email hoặc mật khẩu không đúng" });
    }

    if (!user.emailVerified) {
      return res.status(403).json({ message: "EMAIL_NOT_VERIFIED" });
    }

    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;

    res.json({
      accessToken,
      user: userResponse,
    });
  } catch (error) {
    console.error("🔥 LOGIN ERROR:", error);
    res.status(500).json({ message: "Lỗi hệ thống khi đăng nhập" });
  }
};

/**
 * LOGOUT - Đăng xuất
 */
export const logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      await User.findOneAndUpdate(
        { refreshToken: token },
        { refreshToken: null }
      );
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    res.json({ message: "Đã đăng xuất thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * REFRESH TOKEN - Cấp mới Access Token
 */
export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.sendStatus(401);

    const user = await User.findOne({ refreshToken: token });
    if (!user) return res.sendStatus(403);

    jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err || decoded.id !== user._id.toString()) {
        return res.sendStatus(403);
      }

      const newAccessToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
      );

      res.json({ accessToken: newAccessToken });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET PROFILE
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -refreshToken"
    );
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
