import { isNil } from '@llm/commons';

export function getPayload() {
  return {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };
}

export function postPayload<T>(data?: T) {
  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data ?? {}),
  };
}

export function putPayload<T>(body?: T) {
  return {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body ?? {}),
  };
}

export function deletePayload<T>(body?: T) {
  return {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body ?? {}),
  };
}

export function formDataPayload(method: 'POST' | 'PATCH' | 'PUT') {
  return (body: FormData) => ({
    method,
    body,
  });
}

export function patchPayload<T>(body: T) {
  return {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };
}

export function jsonToFormData<
  T extends {
    files?: Record<string, File> | File[];
  },
>({
  files,
  ...json
}: T): FormData {
  const formData = new FormData();

  for (const [key, value] of Object.entries<any>(json)) {
    if (isNil(value)) {
      continue;
    }

    if (value instanceof File) {
      formData.append('file', value);
    }
    else {
      let mappedValue = value;

      if (value !== null && (typeof value === 'object' || Array.isArray(value))) {
        mappedValue = JSON.stringify(value, (_, keyValue) => {
          if (keyValue instanceof File) {
            return undefined;
          }

          return keyValue;
        });
      }

      formData.append(key, mappedValue);
    }
  }

  if (files) {
    Object.values(files).forEach((file) => {
      formData.append(file.name, file);
    });
  }

  return formData;
}
