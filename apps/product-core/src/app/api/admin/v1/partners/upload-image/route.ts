import { createAdminClient } from '../../../../../../lib/supabase/admin';
import {
  bearerToken,
  failure,
  requestIdFor,
  staffAuthService,
  success,
} from '../../../../../../server/staff-auth-http';

const BUCKET = 'partner-images';

export const POST = async (request: Request): Promise<Response> => {
  const requestId = requestIdFor(request);
  const token = bearerToken(request);
  if (token === null) return failure('UNAUTHORIZED', requestId, 401);
  const session = await staffAuthService().getSession(token);
  if (session === null) return failure('UNAUTHORIZED', requestId, 401);

  const supabase = createAdminClient();
  if (supabase === null) return failure('INTERNAL_ERROR', requestId, 500);

  const formData = await request.formData();
  const file = formData.get('file');
  if (!(file instanceof File)) return failure('INVALID_INPUT', requestId, 400);

  const ext = file.name.split('.').pop() ?? 'png';
  const fileName = `${crypto.randomUUID()}.${ext}`;

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, file, { contentType: file.type, upsert: false });

  if (error) return failure('INTERNAL_ERROR', requestId, 500);

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(data.path);

  return success<{ url: string }>({ url: urlData.publicUrl }, requestId);
};
