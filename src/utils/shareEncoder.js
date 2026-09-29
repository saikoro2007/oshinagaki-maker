// src/utils/shareEncoder.js

// Uint8Array to URL-safe Base64
function uint8ArrayToBase64Url(bytes) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// URL-safe Base64 to Uint8Array
function base64UrlToUint8Array(base64url) {
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * 共有URL用にロゴ画像を軽量リサイズする（URL長が爆発しないように最大200pxに縮小）
 */
async function optimizeLogoForShare(dataUrl, maxDim = 200) {
  if (!dataUrl || !dataUrl.startsWith('data:image')) return dataUrl || '';
  if (typeof Image === 'undefined' || typeof document === 'undefined') return dataUrl;

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      if (width > height) {
        if (width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        }
      } else {
        if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      // WebP または PNG で出力
      try {
        const webp = canvas.toDataURL('image/webp', 0.8);
        if (webp.startsWith('data:image/webp') && webp.length < 15000) {
          return resolve(webp);
        }
      } catch (e) {}

      const png = canvas.toDataURL('image/png');
      if (png.length < 18000) {
        return resolve(png);
      }

      // サイズが大きい場合はJPEG（白背景）に圧縮
      const jpgCanvas = document.createElement('canvas');
      jpgCanvas.width = width;
      jpgCanvas.height = height;
      const jpgCtx = jpgCanvas.getContext('2d');
      jpgCtx.fillStyle = '#ffffff';
      jpgCtx.fillRect(0, 0, width, height);
      jpgCtx.drawImage(img, 0, 0, width, height);
      resolve(jpgCanvas.toDataURL('image/jpeg', 0.75));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

/**
 * メニューデータをURL共有用にgzip圧縮＋URL-Safe Base64化する（ロゴ画像も軽量化して保持）
 */
export async function compressMenuData(type, menuData) {
  const cleanData = JSON.parse(JSON.stringify(menuData));

  // ロゴ画像が存在する場合、URLが肥大化しないよう軽量化して共有データに含める
  const rawLogo = cleanData.logoImage || cleanData.noticeBlock?.logoImage || '';
  if (rawLogo) {
    try {
      const optimizedLogo = await optimizeLogoForShare(rawLogo);
      cleanData.logoImage = optimizedLogo;
      if (cleanData.noticeBlock) {
        cleanData.noticeBlock.logoImage = optimizedLogo;
      }
    } catch (e) {
      console.warn('Failed to optimize logo for share, keeping original:', e);
    }
  }

  const payload = {
    v: 1,
    t: type, // 'grand' | 'drink' | 'daily'
    d: cleanData
  };

  const jsonStr = JSON.stringify(payload);
  const encoder = new TextEncoder();
  const rawBytes = encoder.encode(jsonStr);

  // gzip 圧縮
  if (typeof CompressionStream !== 'undefined') {
    const cs = new CompressionStream('gzip');
    const writer = cs.writable.getWriter();
    writer.write(rawBytes);
    writer.close();
    const compressedResponse = await new Response(cs.readable).arrayBuffer();
    return uint8ArrayToBase64Url(new Uint8Array(compressedResponse));
  } else {
    // フォールバック
    return uint8ArrayToBase64Url(rawBytes);
  }
}

/**
 * URL共有文字列からメニューデータを復元する
 */
export async function decompressMenuData(encodedStr) {
  if (!encodedStr) return null;
  const bytes = base64UrlToUint8Array(encodedStr);

  let jsonStr = '';
  if (typeof DecompressionStream !== 'undefined') {
    try {
      const ds = new DecompressionStream('gzip');
      const writer = ds.writable.getWriter();
      writer.write(bytes);
      writer.close();
      const decompressedBuffer = await new Response(ds.readable).arrayBuffer();
      jsonStr = new TextDecoder().decode(decompressedBuffer);
    } catch (e) {
      // 圧縮なしフォールバック
      jsonStr = new TextDecoder().decode(bytes);
    }
  } else {
    jsonStr = new TextDecoder().decode(bytes);
  }

  const parsed = JSON.parse(jsonStr);
  return {
    type: parsed.t || 'grand',
    data: parsed.d
  };
}
