export async function GET() {
  return Response.json({ success: true, message: 'ok', data: { status: 'healthy' } });
}
