<?php

namespace App\Livewire\Dashboard\Permissions;
use Livewire\Component;
use Spatie\Permission\Models\Permission;


class Index extends Component
{
  public $search = '';
  public $title;
  public $selected = [];
  public $action;
  public function mount() {
    $this->title = __('Permissions');
  }
  public function permissions() {
    return Permission::paginate();
  }
  public function edit(permission $permission) {
    $this->redirect(route('dashboard.permissions.edit', $permission), true);
  }
  public function delete(permission $permission) {
    $delete = $permission->delete();
    if ($delete) {
      session()->flash('status', __('Delete success.'));
    } else {
      $this->addError('status', __('Delete failed!'));
    }
  }
  public function doAction() {
    dd('action', $this->action, 'selected', $this->selected);
  }
  public function render() {
    return view('livewire.dashboard.permissions.index', [
      'permissions' => $this->permissions(),
    ])->layout('layouts.dashboard', [
      'title' => $this->title,

    ]);
  }
}