<?php

namespace App\Livewire\Site\Posts;

use App\Models\Post;
use Livewire\Component;

class Item extends Component
{
    public Post $post;
    public function render()
    {
        return view('livewire.site.posts.item')->layout("layouts.{$this->post->getMeta('template', 'cover')}", [
            'title' => $this->post->name,
            'subtitle' => "<i class=\"icon bi-person-fill\"></i> {$this->post->author_name}",
            'secondSubtitle' => "<i class=\"icon bi-calendar-fill\"></i> {$this->post->date}",
            'image' => $this->post->getThumbnailUrl('lg')
        ]);
    }
}
