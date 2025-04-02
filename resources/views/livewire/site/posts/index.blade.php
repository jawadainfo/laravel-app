<div class="container py-6">
    @if ($posts && $posts->isNotEmpty())
        <div class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
            @foreach ($posts as $post)
                <div wire:key="{{ $post->id }}" id="post-{{ $post->id }}" class="card">
                    <div class="relative aspect-video bg-gray-200 flex items-center justify-center overflow-hidden">
                        <a href="{{ $post->permalink }}" title="{{ $post->name }}"
                            class="leading-none w-full h-full overflow-hidden">
                            <img class="w-full h-full object-cover" src="{{ $post->getThumbnailUrl('sm') }}"
                                alt="{{ $post->name }}">
                        </a>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title text-center truncate text-sm">
                            <a wire:navigate class="text-inherit" href="{{ $post->permalink }}"
                                title="{{ $post->name }}">{{ $post->name }}</a>
                        </h5>
                    </div>
                </div>
            @endforeach
        </div>
        <div class="mt-3">
            {{ $posts->links() }}
        </div>
    @endif
</div>
