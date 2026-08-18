export const validateEmail = (email) => {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  return re.test(email)
}

export const validateRating = (rating) => {
  return typeof rating === 'number' && rating >= 1 && rating <= 5
}

export const validatePoemData = (data) => {
  const errors = []

  if (!data.title || data.title.trim() === '') {
    errors.push('Title is required')
  } else if (data.title.length > 200) {
    errors.push('Title must be less than 200 characters')
  }

  if (!data.content || data.content.trim() === '') {
    errors.push('Content is required')
  } else if (data.content.length < 10) {
    errors.push('Content must be at least 10 characters')
  }

  if (!data.writtenDate) {
    errors.push('Written date is required')
  } else if (isNaN(new Date(data.writtenDate))) {
    errors.push('Invalid date format')
  }

  return errors
}

export const validateReaderData = (data) => {
  const errors = []
  const validAnimals = ['cat', 'dog', 'fox', 'owl', 'bird', 'rabbit', 'panda', 'koala', 'penguin', 'tiger', 'lion', 'bear']

  if (!data.name || data.name.trim() === '') {
    errors.push('Name is required')
  } else if (data.name.length < 2) {
    errors.push('Name must be at least 2 characters')
  } else if (data.name.length > 50) {
    errors.push('Name must be less than 50 characters')
  }

  if (data.email && !validateEmail(data.email)) {
    errors.push('Invalid email format')
  }

  if (data.profilePicture && !validAnimals.includes(data.profilePicture)) {
    errors.push(`Profile picture must be one of: ${validAnimals.join(', ')}`)
  }

  return errors
}

export const validateThemeData = (data) => {
  const errors = []

  if (!data.name || data.name.trim() === '') {
    errors.push('Theme name is required')
  }

  if (data.colors) {
    const colorFields = ['primary', 'secondary', 'background', 'text', 'accent']
    for (const field of colorFields) {
      if (data.colors[field] && !/^#[0-9A-Fa-f]{6}$/.test(data.colors[field])) {
        errors.push(`Invalid color format for ${field}. Use hex format (#RRGGBB)`)
      }
    }
  }

  return errors
}

export const validateLoginData = (data) => {
  const errors = []

  if (!data.username || data.username.trim() === '') {
    errors.push('Username is required')
  }

  if (!data.password || data.password.trim() === '') {
    errors.push('Password is required')
  } else if (data.password.length < 8) {
    errors.push('Password must be at least 8 characters')
  }

  return errors
}

export default {
  validateEmail,
  validateRating,
  validatePoemData,
  validateReaderData,
  validateThemeData,
  validateLoginData
}
