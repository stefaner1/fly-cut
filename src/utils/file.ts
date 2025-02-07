/**
 * Compare file sizes, first parameter is file size as a pure number, second parameter is target size as a number+unit string, like '1MB'
 * @param size
 * @param target
 */
export const compareSize = (size: number, target: string): boolean => {
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = sizes.findIndex(item => item === target.replace(/\d+/, ''));
  return size > parseInt(target) * k ** i;
};

interface OSSPolicy {
  expire: number;
  policy: string;
  signature: string;
  accessid: string;
  host: string;
  dir: string;
}

let policy: OSSPolicy | undefined;

(async() => {
  const response = await fetch('https://zpoftcpzawaz.cloud.sealos.io');
  policy = await response.json();
})();

// Upload file and get URL
export const uploadFile = (file: File, onProgress?: (percentComplete: string) => any): Promise<string> => {
  if (!policy) {
    console.error('OSS policy is not set');
    throw new Error('OSS policy is not set');
  }
  const formData = new FormData();

  // 'key' : g_object_name,
  // 'policy': policyBase64,
  // 'OSSAccessKeyId': accessid, 
  // 'success_action_status' : '200', // Make server return 200, otherwise it defaults to 204
  // 'callback' : callbackbody,
  // 'signature': signature,
  formData.append('policy', policy.policy);
  formData.append('OSSAccessKeyId', policy.accessid);
  formData.append('signature', policy.signature);
  const key = policy.dir + Date.now().toString();
  formData.append('key', key);
  formData.append('success_action_status', '200');
  formData.append('file', file);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    // Set request headers
    xhr.open('POST', policy.host);
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(`${policy?.host}/${key}`);
      } else {
        reject(xhr);
      }
    };
    xhr.upload.onprogress = event => {
      if (event.lengthComputable) {
        const percentComplete = ((event.loaded / event.total) * 100).toFixed(0);
        onProgress && onProgress(percentComplete);
      }
    };
    xhr.onerror = () => {
      reject(xhr.statusText);
    };
    xhr.send(formData);
  });
};

interface FileUploadOptions {
  accept: string
  multiple: boolean
  max?: string
}

export const selectFile = (options: FileUploadOptions): Promise<File[]> => {
  return new Promise((resolve, reject) => {
    // Create input[file] element
    const input = document.createElement('input');
    // Set corresponding attributes
    input.setAttribute('type', 'file');
    input.setAttribute('accept', options.accept);
    if (options.multiple) {
      input.setAttribute('multiple', 'multiple');
    } else {
      input.removeAttribute('multiple');
    }
    // Bind events
    input.onchange = function() {
      let files = Array.from(this.files);
      // Get file list
      if (files) {
        const length = files.length;
        files = files.filter(file => {
          if (options.max) {
            return !compareSize(file.size, options.max);
          } else {
            return true;
          }
        });
        if (files && files.length > 0) {
          if (length !== files.length) {
            // message.warning(`Files larger than ${options.max} have been filtered out`);
          }
          resolve(files);
        } else {
          // message.warning(`Upload file size cannot exceed ${options.max}`);
          reject(new Error(`Upload file size cannot exceed ${options.max}`));
        }
      } else {
        reject(new Error('No files selected'));
      }
    };

    input.oncancel = function() {
      reject(new Error('No files selected'));
    };
    input.click();
  });
};

export const fileAsDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = () => {
      reject(reader.error);
    };
    reader.readAsDataURL(file);
  });
};

export const getVideoCoverUrl = (url: string) => {
  return `${url}?x-oss-process=video/snapshot,t_0,f_png,w_720,m_fast,ar_auto`;
};

// Calculate file size
export const getFileSize = (size: number): string => {
  if (!size) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(size) / Math.log(k));
  return `${(size / k ** i).toFixed(2)} ${sizes[i]}`;
};

// Convert Base64 data to Blob object
export function base64ToBlob(base64Data: string, contentType: string) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = atob(base64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
}

// Convert Blob object to File object
export function blobToFile(blob: Blob, fileName: string) {
  const file = new File([blob], fileName, { type: blob.type });
  return file;
}

// const fontList = fontJson

// // Download sticker font
// export function downStickerFont(layers) {
//   return Promise.all(
//     layers.map((item: any) => {
//       if (item.fontFamily && fontList.find((font) => font.name === item.fontFamily)) {
//         const font = new FontFaceObserver(item.fontFamily)
//         return font.load(null, 150000)
//       }
//       return Promise.resolve()
//     }),
//   )
// }

export async function getResourceType4Response(url: string) {
  try {
    const response = await fetch(url);
    const contentType = response.headers.get('Content-Type');
    return contentType || null; // Return null if no Content-Type header
  } catch (error) {
    console.error('Error fetching image type:', error);
    return null;
  }
}
