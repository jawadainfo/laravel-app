<div>
  <x-slot name="actions">
    <a wire:navigate href="{{ route('dashboard.permissions') }}" class="btn xs btn-outline-primary">
      @icon('bi-list-ul')
      <span>{{ __('All') }}</span>
    </a>
    @if (!empty($permission->id))
    <a wire:navigate href="{{ route('dashboard.permissions.create') }}" class="">
      @icon('bi-plus')
      <span>{{ __('Create') }}</span>
    </a>
    @endif
  </x-slot>
  <div class="card card-body">
    <form wire:submit="save">
      <div class="grid grid-cols-1 gap-4">
        <div class="col">
          <x-fgx::input wire:model.live="name" id="name" :label="__('Name')" autofocus />
        </div>
        <div class="col">
          <x-fgx::select wire:model.live="guard_name" id="guard_name" :label="__('Guard name')"
            startIcon="bi-envelope-fill" :options="$guard_name_options" />
        </div>
        <div class="col">
          <button type="submit" class="btn btn-primary">{{ __('Save') }}</button>
        </div>
      </div>
    </form>
    <x-fgx::status class="mt-4 alert-soft" />   
  </div>
</div>