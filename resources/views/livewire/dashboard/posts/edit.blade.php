<div>
    <x-slot name="actions">
        <a wire:navigate href="{{ route('dashboard.posts') }}" class="btn xs btn-outline-primary">
            @icon('bi-list-ul')
            <span>{{ __('All') }}</span>
        </a>
        @if ($this->saved())
            <a wire:navigate href="{{ route('dashboard.posts.create') }}" class="btn xs btn-outline-green">
                @icon('bi-plus')
                <span>{{ __('Create') }}</span>
            </a>
        @endif
    </x-slot>
    <form wire:submit="save">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="col md:col-span-3">
                <div class="card">
                    <div class="card-body">
                        <div class="grid grid-cols-1 gap-4">
                            <div class="col">
                                <fgx:input wire:model.live="name" id="name" :label="__('Name')" autofocus />
                                @if ($this->saved())
                                    <a href="{{ $post->permalink }}" target="_blank"
                                        class="link text-sm flex-space-2 mt-2">
                                        @icon('bi-box-arrow-up-right')
                                        <span>{{ $post->permalink }}</span>
                                    </a>
                                @endif
                            </div>
                            <div class="col">
                                <fgx:input wire:model.live="slug" id="slug" :label="__('Slug')" autofocus />

                            </div>
                            <div class="col">
                                <fgx:editor wire:model.live="content" id="content" :label="__('Content')"
                                    :value="$content" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card mt-6">
                    <div class="card-body">
                        <fgx:file id="files" wire:model.live="files" :label="__('Files')" :previews="$previewsFiles" multiple/>
                    </div>
                </div>
            </div>
            <!-- End Column 1 -->
            <div class="col">
                <div class="card">
                    <fgx:card-header :title="__('Featured image')" />
                    <div class="card-body">
                        <div class="grid grid-cols-1 gap-4">
                            <div class="col">
                                <fgx:file id="thumbnail" wire:model.live="thumbnail" :label="__('Featured image')" accept="image/*"
                                    :previews="$previewsThumbnail" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card mt-6">
                    <fgx:card-header :title="__('Seo')" />
                    <div class="card-body">
                        <div class="grid grid-cols-1 gap-4">
                            <div class="col">
                                <fgx:input type="text" id="seo_title" wire:model.live="seo_title"
                                    :label="__('Seo title')" />
                            </div>
                            <div class="col">
                                <fgx:textarea id="seo_description" wire:model.live="seo_description"
                                    :label="__('Seo description')" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card mt-6">
                    <fgx:card-header :title="__('Design')" />
                    <div class="card-body">
                        <div class="grid grid-cols-1 gap-4">
                            <div class="col">
                                <fgx:select id="template" wire:model.live="template" :label="__('Template')"
                                    :options="$template_options" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card mt-6">
                    <fgx:card-header :title="__('Publish')" />
                    <div class="card-body">
                        <div class="grid grid-cols-1 gap-4">
                            <div class="col">
                                <fgx:radio id="status" wire:model.live="status" :label="__('Status')"
                                    :options="[
                                        [
                                            'label' => __('Draft'),
                                            'value' => 'draft',
                                        ],
                                        [
                                            'label' => __('Publish'),
                                            'value' => 'publish',
                                        ],
                                        [
                                            'label' => __('Trash'),
                                            'value' => 'trash',
                                        ],
                                    ]" />
                            </div>
                            <div class="col">
                                <button type="submit" class="btn btn-primary w-full">
                                    <i class="icon bi-floppy"></i>
                                    <span wire:loading.remove wire:target="save">{{ __('Save') }}</span>
                                    <fgx:loader wire:loading wire:target="save" />
                                </button>
                                <fgx:status id="save" class="mt-3 sm alert-soft" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- End Column 2 -->
        </div>
    </form>
</div>
