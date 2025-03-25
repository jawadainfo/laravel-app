<?php

use App\Livewire\Dashboard\Home\Index as DashboardHome;
use App\Livewire\Dashboard\Profile\Index as Profile;
use App\Livewire\Dashboard\Users\Edit as UsersEdit;
use App\Livewire\Dashboard\Roles\Index as Roles;
use App\Livewire\Dashboard\Roles\Edit as EditRole;
use App\Livewire\Dashboard\Permissions\Index as Permissions;
use App\Livewire\Dashboard\Permissions\Edit as EditPermission;
use Illuminate\Support\Facades\Route;
use App\Livewire\Dashboard\Users\Index as UsersIndex;
Route::group(['prefix' => 'dashboard', 'middleware' => ['auth', 'verified']], function () {
  //dashboard home
  Route::get('/', DashboardHome::class)->name('dashboard');

  //profile
  Route::get('profile/{user?}', Profile::class)->name('dashboard.profile')->middleware(['edit_profile']);

  //users
  Route::group(['prefix' => 'users', 'middleware' => ['can:manage users']], function () {
    Route::get('/', UsersIndex::class)->name('dashboard.users');
    Route::get('edit/{user}', UsersEdit::class)->name('dashboard.users.edit');
    Route::get('create', UsersEdit::class)->name('dashboard.users.create');
  });

  //roles
  Route::group(['prefix' => 'roles', 'middleware' => ['can:manage roles']], function () {
    Route::get('/', Roles::class)->name('dashboard.roles');
    Route::get('edit/{role}', EditRole::class)->name('dashboard.roles.edit');
    Route::get('create', EditRole::class)->name('dashboard.roles.create');
  });

  Route::group(['prefix' => 'permissions'], function () {
    Route::get('/', Permissions::class)->name('dashboard.permissions');
    Route::get('edit/{permission}', EditPermission::class)->name('dashboard.permissions.edit');
    Route::get('create', EditPermission::class)->name('dashboard.permissions.create');
  });

});