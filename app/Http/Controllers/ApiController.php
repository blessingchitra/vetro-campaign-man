<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class ApiController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Api/Index');
    }
}
