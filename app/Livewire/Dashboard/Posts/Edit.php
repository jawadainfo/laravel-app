<?php

namespace App\Livewire\Dashboard\Posts;

use App\Models\Post;
use App\Traits\WithEditModel;
use Illuminate\Validation\Rule;
use Illuminate\Support\Arr;
use Livewire\Attributes\Validate;
use Livewire\Component;
use Livewire\Attributes\Locked;

class Edit extends Component
{
    use WithEditModel;
    protected $model_type = 'post';
    #[Locked]
    public ?Post $post;
    public $title = '';

    #[Validate]
    public $name;

    #[Validate]
    public $slug;

    #[Validate]
    public $type = 'post';

    #[Validate]
    public $status = 'trash';

    #[Validate]
    public $content;

    #[Validate]
    public $template;

    #[Validate]
    public $seo_title;

    #[Validate]
    public $seo_description;

    #[Validate]
    public $thumbnail;
    //public $previewsThumbnail;

    #[Validate]
    public $files = [];
    //public $previewsFiles;

    protected $fillable_data = ['name', 'slug', 'type', 'status', 'content'];
    protected $fillable_meta = ['seo_title', 'seo_description', 'template'];
    protected $fillable_media = ['thumbnail', 'files'];
    public function mount(?Post $post)
    {
        $this->post = $post;
        $this->title = $this->saved()
            ? __("Edit post :name", ["name" => $this->post->name])
            : __("Create post");
    }
    public function afterFill()
    {
        $this->type = 'post';
    }
    public function rules()
    {
        return [
            "name" => ["required","string","max:255"],
            "slug" => ["nullable", "string", "max:255",Rule::unique("posts", "slug")->ignore($this->post)],
            "type" => ["required","string", Rule::in(['post'])],
            "status" => ["required","string",Rule::in(['draft', 'publish', 'trash'])],
            "content" => ["nullable","string",],
            "template" => ["nullable","string",Rule::in(config('layouts.layouts'))],
            "seo_title" => ["nullable","string","max:255"],
            "seo_description" => ["nullable","string","max:255"],
            'thumbnail' => ['nullable','image','max:10240'],
            'files' => ['nullable','array'],
            'files.*' => ['nullable','file'],
        ];
    }
    public function template_options(){
        $layouts = config('layouts.layouts');
        return Arr::map($layouts, function($layout){
            return [
                'label' => __("layouts.$layout"),
                'value' => $layout,
            ];
        });
    }
    public function beforeSave() {
        if(empty($this->slug)){
            $this->slug = Post::generateSlug($this->name);
        }
        $this->type = 'post';
    }
    public function afterSave() {
        if(!request()->routeIs('dashboard.posts.edit')){
            $this->redirect(route('dashboard.posts.edit', $this->post), true);
        }
    }
    public function render()
    {
        return view("livewire.dashboard.posts.edit", [
            'previewsThumbnail' => $this->getPreviews('thumbnail'),
            'previewsFiles' => $this->getPreviews('files'),
            'template_options' => $this->template_options(),
        ])->layout('layouts.dashboard', [
            'title' => $this->title,
        ]);
    }
}
