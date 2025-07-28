<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Carbon\Carbon;

class AuthController extends Controller
{
    protected $supabaseClient;

    public function __construct()
    {
        $supabaseUrl = env('SUPABASE_URL');
        $supabaseKey = env('SUPABASE_KEY');

        if (empty($supabaseUrl) || empty($supabaseKey)) {
            \Log::error('Supabase configuration missing', [
                'url' => $supabaseUrl ?? 'not set',
                'key' => $supabaseKey ? 'set' : 'not set',
            ]);
            throw new \Exception('Supabase URL or Key is not configured');
        }

        $this->supabaseClient = new Client([
            'base_uri' => rtrim($supabaseUrl, '/'),
            'headers' => [
                'Authorization' => 'Bearer ' . $supabaseKey,
                'apikey' => $supabaseKey,
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ],
        ]);

        \Log::info('Supabase client initialized', [
            'url' => $supabaseUrl,
            'headers' => [
                'Authorization' => 'Bearer [redacted]',
                'apikey' => '[redacted]',
            ],
        ]);
    }

    public function login(Request $request)
    {
        \Log::info('Login request received', $request->only('email'));

        $credentials = $request->only('email', 'password');

        try {
            // Validate request
            $request->validate([
                'email' => 'required|string|email',
                'password' => 'required|string',
            ]);

            // Attempt Supabase authentication
            \Log::info('Attempting Supabase login', ['email' => $request->email]);
            $response = $this->supabaseClient->post('/auth/v1/token?grant_type=password', [
                'json' => [
                    'email' => $request->email,
                    'password' => $request->password,
                ],
            ]);

            $supabaseData = json_decode($response->getBody(), true);
            \Log::info('Supabase login successful', ['user_id' => $supabaseData['user']['id']]);

            // Check local database
            $user = User::where('email', $request->email)->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                \Log::warning('Local credentials invalid', ['email' => $request->email]);
                return response()->json(['error' => 'Invalid credentials'], 401);
            }

            // Check email verification
            if (!$supabaseData['user']['confirmed_at']) {
                \Log::warning('Email not verified', ['email' => $request->email]);
                return response()->json(['error' => 'Please verify your email first'], 403);
            }

            // Update local email verification status
            if ($user->email_verified_at === null && $supabaseData['user']['confirmed_at']) {
                try {
                    $verifiedAt = Carbon::parse($supabaseData['user']['confirmed_at'])->format('Y-m-d H:i:s');
                    $user->email_verified_at = $verifiedAt;
                    $user->save();
                    \Log::info('Local email_verified_at updated', [
                        'email' => $user->email,
                        'email_verified_at' => $verifiedAt,
                    ]);
                } catch (\Exception $e) {
                    \Log::error('Failed to update email_verified_at', [
                        'email' => $user->email,
                        'error' => $e->getMessage(),
                    ]);
                    return response()->json(['error' => 'Failed to update verification status'], 500);
                }
            }

            // Generate JWT token
            $token = JWTAuth::fromUser($user);
            \Log::info('JWT token generated', ['email' => $request->email]);

            return response()->json(['token' => $token], 200);
        } catch (RequestException $e) {
            $responseBody = $e->hasResponse() ? (string) $e->getResponse()->getBody() : 'No response';
            \Log::error('Supabase login failed', [
                'message' => $e->getMessage(),
                'response' => $responseBody,
                'email' => $request->email,
            ]);
            return response()->json(['error' => 'Invalid credentials'], 401);
        } catch (\Exception $e) {
            \Log::error('Login error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'email' => $request->email,
            ]);
            return response()->json(['error' => 'Server error: ' . $e->getMessage()], 500);
        }
    }

    public function verify(Request $request)
    {
        $token = $request->query('access_token');
        $type = $request->query('type');

        if ($type !== 'signup' || !$token) {
            return response()->json(['error' => 'Invalid verification link'], 400);
        }

        try {
            $response = $this->supabaseClient->get('/auth/v1/user', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $token,
                    'apikey' => env('SUPABASE_KEY'),
                ],
            ]);

            $supabaseUser = json_decode($response->getBody(), true);

            if ($supabaseUser['confirmed_at']) {
                $user = User::where('supabase_user_id', $supabaseUser['id'])->first();
                if ($user && !$user->email_verified_at) {
                    $verifiedAt = Carbon::parse($supabaseUser['confirmed_at'])->format('Y-m-d H:i:s');
                    $user->email_verified_at = $verifiedAt;
                    $user->save();
                    \Log::info('Email verified for user', [
                        'email' => $user->email,
                        'email_verified_at' => $verifiedAt,
                    ]);
                }
                return response()->json(['message' => 'Email verified successfully']);
            }

            return response()->json(['error' => 'Email not verified'], 400);
        } catch (RequestException $e) {
            \Log::error('Supabase verification failed', [
                'message' => $e->getMessage(),
                'response' => $e->hasResponse() ? (string) $e->getResponse()->getBody() : 'No response',
            ]);
            return response()->json(['error' => 'Verification failed: ' . $e->getMessage()], 400);
        }
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|string|email|max:100|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|in:admin,mahasiswa,dosen,lainnya',
            'phone' => 'nullable|string|max:20',
        ]);

        \Log::info('Register request received', $request->only('email', 'name', 'role', 'phone'));

        try {
            $response = $this->supabaseClient->post('/auth/v1/signup', [
                'json' => [
                    'email' => $request->email,
                    'password' => $request->password,
                    'data' => [
                        'name' => $request->name,
                        'role' => $request->role,
                        'phone' => $request->phone,
                    ],
                ],
            ]);

            $supabaseUser = json_decode($response->getBody(), true);
            \Log::info('Supabase registration successful', ['user_id' => $supabaseUser['id']]);

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role,
                'phone' => $request->phone,
                'supabase_user_id' => $supabaseUser['id'],
                'email_verified_at' => null,
            ]);

            $token = JWTAuth::fromUser($user);

            return response()->json([
                'user' => $user,
                'token' => $token,
                'message' => 'Registration successful! Please check your email to verify your account.',
            ], 201);
        } catch (RequestException $e) {
            $responseBody = $e->hasResponse() ? (string) $e->getResponse()->getBody() : 'No response';
            \Log::error('Supabase registration failed', [
                'message' => $e->getMessage(),
                'response' => $responseBody,
            ]);
            return response()->json([
                'error' => 'Registration failed: ' . $e->getMessage(),
            ], 400);
        } catch (\Exception $e) {
            \Log::error('Registration error', ['message' => $e->getMessage()]);
            return response()->json([
                'error' => 'Registration failed: ' . $e->getMessage(),
            ], 400);
        }
    }

    public function profile()
    {
        return response()->json(auth()->user());
    }

    public function logout()
    {
        auth()->logout();
        return response()->json(['message' => 'Successfully logged out']);
    }

    public function refresh()
    {
        return response()->json([
            'token' => auth()->refresh()
        ]);
    }
} 