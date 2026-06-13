export function successResponse<T>(status: number, message: string, data: T): Response {
    return new Response(JSON.stringify({ success: true, status, message, data }), {
        headers: { "Content-Type": "application/json" },
        status,
    });
}

export function errorResponse(status: number, message: string): Response {
    return new Response(JSON.stringify({ success: false, status, error: message }), {
        headers: { "Content-Type": "application/json" },
        status,
    });
}