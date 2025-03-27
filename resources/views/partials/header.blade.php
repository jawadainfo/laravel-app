@props([
    'class' => null,
    'atts' => [],
])
<div {!! attributes($atts)->merge([
    'class' => css_classes(['navbar h-14', $class => $class]),
]) !!} class="navbar h-14">
    <button class="navbar-toggle">
        <i class="bi-list"></i>
    </button>
    <x-app-logo class="navbar-brand" />
    <div class="nav navbar-nav navbar-collapse expand-md">
        <x-nav-link wire:navigate :href="route('home')" wire:current="active" icon="bi-house-fill" :label="__('Home')" />
        <x-nav-link wire:navigate :href="route('blog')" wire:current="active" icon="bi-newspaper" :label="__('Blog')" />
        <x-nav-link wire:navigate href="/design" wire:current="active" icon="bi-palette-fill" :label="__('Design')" />

    </div>
    <div class="nav">
        <button type="button" class="nav-link dark-mode-toggle">
        </button>
        <div class="dropdown">
            <button type="button" class="nav-link dropdown-toggle">
                @guest
                    <i class="icon bi-person-fill"></i>
                @endguest
                @auth
                    <span>{{ auth()->user()->name }}</span>
                @endauth
                <i class="icon bi-chevron-down w-3 h-3"></i>
            </button>
            <div class="dropdown-menu dropdown-end w-40">
                @guest
                    <a href="{{ route('login') }}" class="dropdown-link">
                        <i class="icon bi-box-arrow-in-right"></i>
                        <span>{{ __('Sign in') }}</span>
                    </a>
                    <a href="{{ route('register') }}" class="dropdown-link">
                        <i class="icon bi-person-plus"></i>
                        <span>{{ __('Sign up') }}</span>
                    </a>
                @endguest
                @auth
                    <a href="{{ route('dashboard') }}" class="dropdown-link">
                        <i class="icon bi-speedometer"></i>
                        <span>{{ __('Dashboard') }}</span>
                    </a>
                    <a href="{{ route('dashboard.profile') }}" class="dropdown-link">
                        <i class="icon bi-person-gear"></i>
                        <span>{{ __('Profile') }}</span>
                    </a>
                    <a href="{{ route('logout') }}" class="dropdown-link">
                        <i class="icon bi-box-arrow-right"></i>
                        <span>{{ __('Logout') }}</span>
                    </a>
                @endauth
            </div>
        </div>
    </div>
</div>
