/**
 * Input sanitization utilities
 * @module utils/sanitizer
 */

import validator from 'validator';

/**
 * Sanitize text input to prevent XSS and injection attacks
 * @param input - Raw text input
 * @returns Sanitized text
 */
export function sanitizeText(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Remove HTML tags
  let sanitized = validator.stripLow(input);
  sanitized = validator.escape(sanitized);

  // Remove any remaining HTML entities
  sanitized = sanitized.replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/');

  // Remove control characters
  sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '');

  // Trim whitespace
  sanitized = sanitized.trim();

  return sanitized;
}

/**
 * Validate and sanitize target audience input
 * @param audience - Raw audience input
 * @param maxLength - Maximum allowed length (default: 100)
 * @returns Sanitized audience string
 */
export function sanitizeAudience(audience: string, maxLength: number = 100): string {
  if (!audience || typeof audience !== 'string') {
    return '';
  }

  // Sanitize text
  let sanitized = sanitizeText(audience);

  // Enforce max length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
}

/**
 * Validate base64 image string
 * @param base64String - Base64 encoded image
 * @returns Boolean indicating if valid
 */
export function isValidBase64Image(base64String: string): boolean {
  if (!base64String || typeof base64String !== 'string') {
    return false;
  }

  // Check for data URI prefix
  const dataUriRegex = /^data:image\/(jpeg|jpg|png);base64,/;
  if (!dataUriRegex.test(base64String)) {
    return false;
  }

  // Extract base64 data
  const base64Data = base64String.split(',')[1];
  if (!base64Data) {
    return false;
  }

  // Validate base64 format
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  return base64Regex.test(base64Data);
}

/**
 * Calculate size of base64 string in bytes
 * @param base64String - Base64 encoded string
 * @returns Size in bytes
 */
export function getBase64Size(base64String: string): number {
  if (!base64String || typeof base64String !== 'string') {
    return 0;
  }

  // Remove data URI prefix if present
  const base64Data = base64String.includes(',')
    ? base64String.split(',')[1]
    : base64String;

  // Calculate size (base64 encoding increases size by ~33%)
  const padding = (base64Data.match(/=/g) || []).length;
  return (base64Data.length * 3) / 4 - padding;
}

/**
 * Sanitize and validate image base64 string
 * @param base64String - Base64 encoded image
 * @param maxSize - Maximum size in bytes
 * @returns Object with validation result and sanitized data
 */
export function sanitizeBase64Image(
  base64String: string,
  maxSize: number
): { valid: boolean; data?: string; error?: string; size?: number } {
  // Validate format
  if (!isValidBase64Image(base64String)) {
    return {
      valid: false,
      error: 'Invalid image format',
    };
  }

  // Check size
  const size = getBase64Size(base64String);
  if (size > maxSize) {
    return {
      valid: false,
      error: `Image size (${(size / (1024 * 1024)).toFixed(2)}MB) exceeds maximum allowed (${(maxSize / (1024 * 1024)).toFixed(2)}MB)`,
      size,
    };
  }

  return {
    valid: true,
    data: base64String,
    size,
  };
}

/**
 * Remove potentially harmful characters from filename
 * @param filename - Original filename
 * @returns Sanitized filename
 */
export function sanitizeFilename(filename: string): string {
  if (!filename || typeof filename !== 'string') {
    return 'unnamed';
  }

  // Remove path traversal attempts
  let sanitized = filename.replace(/\.\./g, '');

  // Remove special characters except dots, hyphens, underscores
  sanitized = sanitized.replace(/[^a-zA-Z0-9._-]/g, '_');

  // Limit length
  if (sanitized.length > 255) {
    const ext = sanitized.split('.').pop();
    const nameWithoutExt = sanitized.substring(0, sanitized.lastIndexOf('.'));
    sanitized = nameWithoutExt.substring(0, 250) + '.' + ext;
  }

  return sanitized;
}
