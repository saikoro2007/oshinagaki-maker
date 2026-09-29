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
 * メニューデータをURL共有用にgzip圧縮＋URL-Safe Base64化する
 */
export async function compressMenuData(type, menuData) {
  // 画像などの巨大データを除去したクリーンなオブジェクトを作成
  const cleanData = JSON.parse(JSON.stringify(menuData));
  if (cleanData.logoImage) cleanData.logoImage = '';
  if (cleanData.noticeBlock?.logoImage) cleanData.noticeBlock.logoImage = '';

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
