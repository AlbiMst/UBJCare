<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MahasiswaProfileController;
use App\Http\Controllers\Api\DosenProfileController;
use App\Http\Controllers\Api\AreaController;
use App\Http\Controllers\Api\ReportController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::get('/verify', [AuthController::class, 'verify']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

Route::middleware('auth:api')->group(function () {
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
});

Route::middleware('auth:api')->group(function () {
    Route::apiResource('mahasiswa-profiles', MahasiswaProfileController::class);
});

Route::middleware('auth:api')->group(function () {
    Route::apiResource('dosen-profiles', DosenProfileController::class);
});

Route::middleware('auth:api')->group(function () {
    Route::apiResource('areas', AreaController::class);
});

Route::middleware('auth:api')->group(function () {
    Route::apiResource('reports', ReportController::class);
});