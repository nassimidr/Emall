// middleware/validation.js

export const validateRegister = (req, res, next) => {
  const { fullName, email, password } = req.body;

  // Validation du nom complet
  if (!fullName || fullName.trim().length < 2) {
    return res.status(400).json({ error: 'Full name must be at least 2 characters long' });
  }

  // Validation de l'email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address' });
  }

  // Validation du mot de passe
  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  // Validation de l'email
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Validation du mot de passe
  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  next();
};

export const validateProfileUpdate = (req, res, next) => {
  const { fullName, email } = req.body;

  // Validation du nom complet
  if (fullName && fullName.trim().length < 2) {
    return res.status(400).json({ error: 'Full name must be at least 2 characters long' });
  }

  // Validation de l'email
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }
  }

  next();
}; 