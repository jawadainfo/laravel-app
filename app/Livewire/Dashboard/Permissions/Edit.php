<?php

namespace App\Livewire\Dashboard\Permissions;

use Illuminate\Validation\Rule;
use Livewire\Attributes\Validate;
use Livewire\Component;
use Spatie\Permission\Models\Permission;

class Edit extends Component
{
  public $title;
  public ?Permission $permission;
  #[Validate]
  public $name;
  #[Validate]
  public $guard_name;
  #[Validate]
  public function mount(Permission $permission) {
    $this->title = $permission->id ? __('Edit permission :name', ['name' => $this->name]) : __('Create Permission');
    $this->permission = $permission;
    $this->fill($this->permission->only(['name', 'guard_name']));

  }
  public function guard_name_options() {
    $options = [];
    foreach (config('auth.guards') as $key => $value) {
      $options[] = [
        'label' => $key,
        'value' => $key,
      ];
    }
    return $options;
  }
  public function rules() {
    return [
      'name' => ['required',
        'string',
        'max:255',
        Rule::unique('permissions', 'name')->ignore($this->permission?->id)],
      'guard_name' => ['required',
        'string',
        Rule::in(array_keys(config('auth.guards')))],
    ];


  }
  public function save() {
    $this->validate();
    $this->permission->fill($this->only(['name', 'guard_name']));
    $save = $this->permission->save();
    if ($save) {
      session()->flash('status', __(' Permissions saved.'));
    } else {
      $this->addError('status', __('Save failed!'));
    }
  }
  public function render() {
    return view('livewire.dashboard.permissions.edit', [
      'guard_name_options' => $this->guard_name_options(),
    ])->layout('layouts.dashboard', [
      'title' => $this->title,
    ]);
  }
}