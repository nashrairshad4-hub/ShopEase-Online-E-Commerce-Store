export interface DjangoFile {
  path: string;
  filename: string;
  category: 'config' | 'models' | 'views' | 'forms' | 'admin' | 'urls' | 'templates' | 'static' | 'docs';
  description: string;
  code: string;
}

export const DJANGO_CODEBASE_FILES: DjangoFile[] = [
  {
    path: 'requirements.txt',
    filename: 'requirements.txt',
    category: 'config',
    description: 'Python dependencies for Django, MySQL client, Pillow for image uploads, and crispy-forms',
    code: `Django>=5.0,<5.2
mysqlclient>=2.2.4
Pillow>=10.2.0
django-crispy-forms>=2.1
crispy-bootstrap5>=2024.2
python-dotenv>=1.0.1
`
  },
  {
    path: 'shopease/settings.py',
    filename: 'settings.py',
    category: 'config',
    description: 'Main Django settings configured for MySQL database, media files, and authentication',
    code: `"""
Django settings for ShopEase E-Commerce Store project.
"""
from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-shopease-ecommerce-production-secret-key-replace-in-prod'

DEBUG = True

ALLOWED_HOSTS = ['*']

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'crispy_forms',
    'crispy_bootstrap5',
    'store.apps.StoreConfig',
]

CRISPY_ALLOWED_TEMPLATE_PACKS = "bootstrap5"
CRISPY_TEMPLATE_PACK = "bootstrap5"

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'shopease.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'store.context_processors.cart_item_count',
                'store.context_processors.categories_processor',
            ],
        },
    },
]

WSGI_APPLICATION = 'shopease.wsgi.application'

# Database Configuration: MySQL
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'shopease_db',
        'USER': 'root',
        'PASSWORD': 'your_mysql_password',
        'HOST': '127.0.0.1',
        'PORT': '3306',
        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
            'charset': 'utf8mb4',
        }
    }
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATICFILES_DIRS = [BASE_DIR / 'static']
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Media files (Product uploads)
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

LOGIN_REDIRECT_URL = 'store:home'
LOGIN_URL = 'store:login'
LOGOUT_REDIRECT_URL = 'store:home'
`
  },
  {
    path: 'store/models.py',
    filename: 'models.py',
    category: 'models',
    description: 'Django ORM Models: Category, Product, Cart, CartItem, Order, OrderItem, Profile',
    code: `from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify
from django.urls import reverse
import uuid

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('store:category_products', args=[self.slug])


class Product(models.Model):
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=280, unique=True, blank=True)
    sku = models.CharField(max_length=50, unique=True, blank=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    image = models.ImageField(upload_to='products/')
    stock = models.PositiveIntegerField(default=10)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=5.0)
    review_count = models.PositiveIntegerField(default=0)
    is_featured = models.BooleanField(default=False)
    is_latest = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        if not self.sku:
            self.sku = f"SKU-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)

    @property
    def current_price(self):
        return self.discount_price if self.discount_price else self.price

    @property
    def discount_percent(self):
        if self.discount_price and self.price > self.discount_price:
            return int(((self.price - self.discount_price) / self.price) * 100)
        return 0

    @property
    def is_in_stock(self):
        return self.stock > 0

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('store:product_detail', args=[self.category.slug, self.slug])


class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    session_key = models.CharField(max_length=40, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Cart #{self.id} for {self.user.username if self.user else 'Guest'}"

    @property
    def subtotal(self):
        return sum(item.total_price for item in self.items.all())

    @property
    def total_items(self):
        return sum(item.quantity for item in self.items.all())


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ('cart', 'product')

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"

    @property
    def total_price(self):
        return self.product.current_price * self.quantity


class Order(models.Model):
    STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('Processing', 'Processing'),
        ('Shipped', 'Shipped'),
        ('Delivered', 'Delivered'),
        ('Cancelled', 'Cancelled'),
    )

    PAYMENT_CHOICES = (
        ('card', 'Credit / Debit Card'),
        ('cod', 'Cash on Delivery (COD)'),
        ('paypal', 'PayPal / Digital Wallet'),
    )

    order_number = models.CharField(max_length=50, unique=True, editable=False)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='orders')
    full_name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100, blank=True, null=True)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100, default='United States')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_CHOICES, default='card')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    shipping = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.order_number:
            self.order_number = f"SE-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Order #{self.order_number} by {self.full_name}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    product_name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)

    @property
    def subtotal(self):
        return self.price * self.quantity

    def __str__(self):
        return f"{self.quantity} x {self.product_name} in #{self.order.order_number}"


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    postal_code = models.CharField(max_length=20, blank=True, null=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)

    def __str__(self):
        return f"Profile of {self.user.username}"
`
  },
  {
    path: 'store/views.py',
    filename: 'views.py',
    category: 'views',
    description: 'Controller logic for product catalog, shopping cart, checkout, orders, authentication, and admin metrics',
    code: `from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required, user_passes_test
from django.core.paginator import Paginator
from django.db.models import Q
from decimal import Decimal

from .models import Category, Product, Cart, CartItem, Order, OrderItem, Profile
from .forms import UserRegisterForm, UserUpdateForm, ProfileUpdateForm, CheckoutForm

def _get_cart(request):
    """Retrieve user cart or guest session cart."""
    if request.user.is_authenticated:
        cart, _ = Cart.objects.get_or_create(user=request.user)
    else:
        if not request.session.session_key:
            request.session.create()
        cart, _ = Cart.objects.get_or_create(session_key=request.session.session_key)
    return cart

def home_view(request):
    categories = Category.objects.all()
    featured_products = Product.objects.filter(is_featured=True, stock__gt=0)[:8]
    latest_products = Product.objects.filter(is_latest=True, stock__gt=0)[:8]
    context = {
        'categories': categories,
        'featured_products': featured_products,
        'latest_products': latest_products,
    }
    return render(request, 'store/home.html', context)

def shop_view(request):
    products = Product.objects.all()
    categories = Category.objects.all()

    # Search filter
    q = request.GET.get('q', '').strip()
    if q:
        products = products.filter(Q(name__icontains=q) | Q(description__icontains=q))

    # Category filter
    category_slug = request.GET.get('category')
    if category_slug:
        products = products.filter(category__slug=category_slug)

    # Price range filter
    min_price = request.GET.get('min_price')
    max_price = request.GET.get('max_price')
    if min_price:
        products = products.filter(price__gte=min_price)
    if max_price:
        products = products.filter(price__lte=max_price)

    # In stock filter
    if request.GET.get('in_stock'):
        products = products.filter(stock__gt=0)

    # Sorting
    sort = request.GET.get('sort', 'newest')
    if sort == 'price_low':
        products = products.order_by('price')
    elif sort == 'price_high':
        products = products.order_by('-price')
    elif sort == 'rating':
        products = products.order_by('-rating')
    else:
        products = products.order_by('-created_at')

    paginator = Paginator(products, 9)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    context = {
        'page_obj': page_obj,
        'categories': categories,
        'search_query': q,
        'active_category': category_slug,
        'sort': sort,
        'total_count': products.count(),
    }
    return render(request, 'store/shop.html', context)

def product_detail_view(request, category_slug, product_slug):
    product = get_object_or_404(Product, slug=product_slug, category__slug=category_slug)
    related_products = Product.objects.filter(category=product.category).exclude(id=product.id)[:4]
    context = {
        'product': product,
        'related_products': related_products,
    }
    return render(request, 'store/product_detail.html', context)

def cart_view(request):
    cart = _get_cart(request)
    items = cart.items.select_related('product').all()
    subtotal = cart.subtotal
    shipping = Decimal('0.00') if subtotal >= Decimal('50.00') or subtotal == 0 else Decimal('9.99')
    tax = round(subtotal * Decimal('0.08'), 2)
    total = subtotal + shipping + tax

    context = {
        'cart': cart,
        'items': items,
        'subtotal': subtotal,
        'shipping': shipping,
        'tax': tax,
        'total': total,
    }
    return render(request, 'store/cart.html', context)

def add_to_cart_view(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    cart = _get_cart(request)
    quantity = int(request.POST.get('quantity', 1))

    if product.stock < quantity:
        messages.error(request, f'Sorry, only {product.stock} units of {product.name} are available.')
        return redirect('store:cart')

    item, created = CartItem.objects.get_or_create(cart=cart, product=product)
    if not created:
        item.quantity += quantity
    else:
        item.quantity = quantity
    item.save()

    messages.success(request, f'Added {product.name} to your shopping cart.')
    return redirect('store:cart')

def update_cart_view(request, item_id):
    item = get_object_or_404(CartItem, id=item_id)
    action = request.POST.get('action')

    if action == 'increase':
        if item.quantity < item.product.stock:
            item.quantity += 1
            item.save()
        else:
            messages.warning(request, 'Max stock reached for this product.')
    elif action == 'decrease':
        if item.quantity > 1:
            item.quantity -= 1
            item.save()
        else:
            item.delete()
    elif action == 'remove':
        item.delete()
        messages.info(request, f'Removed {item.product.name} from cart.')

    return redirect('store:cart')

def checkout_view(request):
    cart = _get_cart(request)
    items = cart.items.select_related('product').all()
    if not items:
        messages.warning(request, 'Your shopping cart is empty.')
        return redirect('store:shop')

    subtotal = cart.subtotal
    shipping = Decimal('0.00') if subtotal >= Decimal('50.00') else Decimal('9.99')
    tax = round(subtotal * Decimal('0.08'), 2)
    total = subtotal + shipping + tax

    if request.method == 'POST':
        form = CheckoutForm(request.POST)
        if form.is_valid():
            order = form.save(commit=False)
            if request.user.is_authenticated:
                order.user = request.user
            order.subtotal = subtotal
            order.shipping = shipping
            order.tax = tax
            order.total_amount = total
            order.save()

            # Create OrderItems and decrease inventory
            for item in items:
                OrderItem.objects.create(
                    order=order,
                    product=item.product,
                    product_name=item.product.name,
                    price=item.product.current_price,
                    quantity=item.quantity
                )
                item.product.stock -= item.quantity
                item.product.save()

            # Clear cart
            items.delete()

            messages.success(request, f'Order placed successfully! Order #{order.order_number}')
            return redirect('store:order_success', order_id=order.id)
    else:
        initial = {}
        if request.user.is_authenticated:
            initial = {
                'full_name': f"{request.user.first_name} {request.user.last_name}".strip() or request.user.username,
                'email': request.user.email,
            }
            if hasattr(request.user, 'profile'):
                initial.update({
                    'phone': request.user.profile.phone,
                    'address': request.user.profile.address,
                    'city': request.user.profile.city,
                    'postal_code': request.user.profile.postal_code,
                })
        form = CheckoutForm(initial=initial)

    context = {
        'form': form,
        'cart': cart,
        'items': items,
        'subtotal': subtotal,
        'shipping': shipping,
        'tax': tax,
        'total': total,
    }
    return render(request, 'store/checkout.html', context)

def order_success_view(request, order_id):
    order = get_object_or_404(Order, id=order_id)
    return render(request, 'store/order_success.html', {'order': order})

@login_required
def order_history_view(request):
    orders = Order.objects.filter(user=request.user).order_by('-created_at')
    return render(request, 'store/order_history.html', {'orders': orders})

def register_view(request):
    if request.user.is_authenticated:
        return redirect('store:home')
    if request.method == 'POST':
        form = UserRegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            Profile.objects.create(user=user)
            login(request, user)
            messages.success(request, f'Welcome to ShopEase, {user.first_name or user.username}!')
            return redirect('store:home')
    else:
        form = UserRegisterForm()
    return render(request, 'store/register.html', {'form': form})

@login_required
def profile_view(request):
    profile, _ = Profile.objects.get_or_create(user=request.user)
    if request.method == 'POST':
        u_form = UserUpdateForm(request.POST, instance=request.user)
        p_form = ProfileUpdateForm(request.POST, request.FILES, instance=profile)
        if u_form.is_valid() and p_form.is_valid():
            u_form.save()
            p_form.save()
            messages.success(request, 'Your profile has been updated!')
            return redirect('store:profile')
    else:
        u_form = UserUpdateForm(instance=request.user)
        p_form = ProfileUpdateForm(instance=profile)

    recent_orders = Order.objects.filter(user=request.user)[:5]
    context = {
        'u_form': u_form,
        'p_form': p_form,
        'recent_orders': recent_orders,
    }
    return render(request, 'store/profile.html', context)
`
  },
  {
    path: 'store/forms.py',
    filename: 'forms.py',
    category: 'forms',
    description: 'Bootstrap-enabled forms for User Registration, Profile Update, and Checkout',
    code: `from django import forms
from django.contrib.auth.models import User
from .models import Order, Profile

class UserRegisterForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Create password'}))
    confirm_password = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Confirm password'}))

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email']
        widgets = {
            'username': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Username'}),
            'first_name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'First Name'}),
            'last_name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Last Name'}),
            'email': forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'Email Address'}),
        }

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get('password')
        confirm_password = cleaned_data.get('confirm_password')
        if password and confirm_password and password != confirm_password:
            raise forms.ValidationError("Passwords do not match.")
        return cleaned_data

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password"])
        if commit:
            user.save()
        return user


class UserUpdateForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email']
        widgets = {
            'first_name': forms.TextInput(attrs={'class': 'form-control'}),
            'last_name': forms.TextInput(attrs={'class': 'form-control'}),
            'email': forms.EmailInput(attrs={'class': 'form-control'}),
        }


class ProfileUpdateForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ['phone', 'address', 'city', 'postal_code', 'avatar']
        widgets = {
            'phone': forms.TextInput(attrs={'class': 'form-control'}),
            'address': forms.TextInput(attrs={'class': 'form-control'}),
            'city': forms.TextInput(attrs={'class': 'form-control'}),
            'postal_code': forms.TextInput(attrs={'class': 'form-control'}),
        }


class CheckoutForm(forms.ModelForm):
    class Meta:
        model = Order
        fields = ['full_name', 'email', 'phone', 'address', 'city', 'state', 'postal_code', 'country', 'payment_method']
        widgets = {
            'full_name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Jane Doe'}),
            'email': forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'jane@example.com'}),
            'phone': forms.TextInput(attrs={'class': 'form-control', 'placeholder': '+1 (555) 000-0000'}),
            'address': forms.TextInput(attrs={'class': 'form-control', 'placeholder': '123 Main St, Apt 4B'}),
            'city': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'New York'}),
            'state': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'NY'}),
            'postal_code': forms.TextInput(attrs={'class': 'form-control', 'placeholder': '10001'}),
            'country': forms.TextInput(attrs={'class': 'form-control', 'value': 'United States'}),
            'payment_method': forms.Select(attrs={'class': 'form-select'}),
        }
`
  },
  {
    path: 'store/admin.py',
    filename: 'admin.py',
    category: 'admin',
    description: 'Django Admin panel configuration with inline order items, custom filters, and stock badges',
    code: `from django.contrib import admin
from .models import Category, Product, Cart, CartItem, Order, OrderItem, Profile

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'created_at')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'discount_price', 'stock', 'rating', 'is_featured', 'is_latest', 'created_at')
    list_filter = ('category', 'is_featured', 'is_latest', 'created_at')
    list_editable = ('price', 'discount_price', 'stock', 'is_featured')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name', 'description', 'sku')
    readonly_fields = ('sku', 'rating', 'review_count', 'created_at', 'updated_at')

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product_name', 'price', 'quantity', 'subtotal')
    can_delete = False

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'full_name', 'email', 'total_amount', 'status', 'payment_method', 'created_at')
    list_filter = ('status', 'payment_method', 'created_at')
    list_editable = ('status',)
    search_fields = ('order_number', 'full_name', 'email', 'phone')
    inlines = [OrderItemInline]
    readonly_fields = ('order_number', 'subtotal', 'discount', 'shipping', 'tax', 'total_amount', 'created_at', 'updated_at')

class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'session_key', 'total_items', 'subtotal', 'updated_at')
    inlines = [CartItemInline]

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone', 'city')
    search_fields = ('user__username', 'user__email', 'phone', 'city')
`
  },
  {
    path: 'store/urls.py',
    filename: 'urls.py',
    category: 'urls',
    description: 'Store routing for all views, cart actions, checkout, and authentication',
    code: `from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

app_name = 'store'

urlpatterns = [
    # Home & Catalog
    path('', views.home_view, name='home'),
    path('shop/', views.shop_view, name='shop'),
    path('category/<slug:category_slug>/', views.shop_view, name='category_products'),
    path('product/<slug:category_slug>/<slug:product_slug>/', views.product_detail_view, name='product_detail'),

    # Shopping Cart
    path('cart/', views.cart_view, name='cart'),
    path('cart/add/<int:product_id>/', views.add_to_cart_view, name='add_to_cart'),
    path('cart/update/<int:item_id>/', views.update_cart_view, name='update_cart'),

    # Checkout & Orders
    path('checkout/', views.checkout_view, name='checkout'),
    path('order/success/<int:order_id>/', views.order_success_view, name='order_success'),
    path('orders/', views.order_history_view, name='order_history'),

    # User Authentication & Profile
    path('register/', views.register_view, name='register'),
    path('login/', auth_views.LoginView.as_view(template_name='store/login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('profile/', views.profile_view, name='profile'),
]
`
  },
  {
    path: 'shopease/urls.py',
    filename: 'urls.py (project)',
    category: 'urls',
    description: 'Root URL routing connecting the admin and the store app, plus static/media serving in development',
    code: `from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('store.urls', namespace='store')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])
`
  },
  {
    path: 'store/context_processors.py',
    filename: 'context_processors.py',
    category: 'config',
    description: 'Global context processors for cart quantity badge and navigation categories in templates',
    code: `from .models import Category, Cart

def categories_processor(request):
    return {
        'nav_categories': Category.objects.all()[:6]
    }

def cart_item_count(request):
    total = 0
    try:
        if request.user.is_authenticated:
            cart = Cart.objects.filter(user=request.user).first()
        else:
            cart = Cart.objects.filter(session_key=request.session.session_key).first()
        if cart:
            total = cart.total_items
    except Exception:
        pass
    return {'cart_count': total}
`
  },
  {
    path: 'templates/base.html',
    filename: 'base.html',
    category: 'templates',
    description: 'Base HTML template with Bootstrap 5 CDN, Bootstrap Icons, responsive meta, alerts, and container',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{% block title %}ShopEase – Online E-Commerce Store{% endblock %}</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
    <!-- Custom CSS -->
    <link rel="stylesheet" href="/static/css/style.css">
    {% block extra_css %}{% endblock %}
</head>
<body class="d-flex flex-column min-vh-100 bg-light">

    <!-- Top Announcement Bar -->
    <div class="bg-dark text-white py-1 text-center small">
        <div class="container d-flex justify-content-between align-items-center">
            <span><i class="bi bi-truck me-1 text-warning"></i> Free Worldwide Shipping on orders over $50</span>
            <div class="d-none d-md-block">
                <span class="me-3"><i class="bi bi-shield-check text-success"></i> 100% Secure Checkout</span>
                <span><i class="bi bi-headset text-info"></i> 24/7 Support</span>
            </div>
        </div>
    </div>

    <!-- Navigation Bar -->
    {% include 'includes/navbar.html' %}

    <!-- Flash Messages -->
    <div class="container mt-3">
        {% if messages %}
            {% for message in messages %}
                <div class="alert alert-{{ message.tags }} alert-dismissible fade show" role="alert">
                    {{ message }}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            {% endfor %}
        {% endif %}
    </div>

    <!-- Main Content -->
    <main class="flex-grow-1">
        {% block content %}{% endblock %}
    </main>

    <!-- Footer -->
    {% include 'includes/footer.html' %}

    <!-- Bootstrap 5 JS Bundle -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <!-- Custom JS -->
    <script src="/static/js/main.js"></script>
    {% block extra_js %}{% endblock %}
</body>
</html>
`
  },
  {
    path: 'templates/includes/navbar.html',
    filename: 'navbar.html',
    category: 'templates',
    description: 'Header navigation with search bar, categories dropdown, cart indicator badge, and user dropdown',
    code: `<nav class="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm py-3">
    <div class="container">
        <!-- Logo -->
        <a class="navbar-brand fw-bold fs-3 text-primary d-flex align-items-center" href="{% url 'store:home' %}">
            <i class="bi bi-bag-check-fill me-2"></i>ShopEase
        </a>

        <!-- Mobile Toggler -->
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMain">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarMain">
            <!-- Nav Links -->
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                    <a class="nav-link fw-semibold" href="{% url 'store:home' %}">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link fw-semibold" href="{% url 'store:shop' %}">Shop</a>
                </li>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle fw-semibold" href="#" role="button" data-bs-toggle="dropdown">
                        Categories
                    </a>
                    <ul class="dropdown-menu shadow-sm">
                        {% for cat in nav_categories %}
                            <li><a class="dropdown-item" href="{% url 'store:category_products' cat.slug %}">{{ cat.name }}</a></li>
                        {% endfor %}
                    </ul>
                </li>
            </ul>

            <!-- Search Form -->
            <form class="d-flex mx-lg-3 my-2 my-lg-0 flex-grow-1 max-w-md" action="{% url 'store:shop' %}" method="GET">
                <div class="input-group">
                    <input class="form-control" type="search" name="q" placeholder="Search products, brands..." value="{{ request.GET.q }}">
                    <button class="btn btn-outline-primary" type="submit">
                        <i class="bi bi-search"></i>
                    </button>
                </div>
            </form>

            <!-- User and Cart -->
            <div class="d-flex align-items-center gap-3">
                <a href="{% url 'store:cart' %}" class="btn btn-light position-relative border">
                    <i class="bi bi-cart3 fs-5"></i>
                    {% if cart_count > 0 %}
                        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            {{ cart_count }}
                        </span>
                    {% endif %}
                </a>

                {% if user.is_authenticated %}
                    <div class="dropdown">
                        <button class="btn btn-outline-secondary dropdown-toggle d-flex align-items-center gap-2" type="button" data-bs-toggle="dropdown">
                            <i class="bi bi-person-circle"></i>
                            <span>{{ user.first_name|default:user.username }}</span>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end shadow-sm">
                            <li><a class="dropdown-item" href="{% url 'store:profile' %}"><i class="bi bi-person me-2"></i>Profile</a></li>
                            <li><a class="dropdown-item" href="{% url 'store:order_history' %}"><i class="bi bi-box-seam me-2"></i>My Orders</a></li>
                            {% if user.is_staff %}
                                <li><a class="dropdown-item text-primary" href="/admin/" target="_blank"><i class="bi bi-speedometer2 me-2"></i>Django Admin</a></li>
                            {% endif %}
                            <li><hr class="dropdown-divider"></li>
                            <li>
                                <form method="POST" action="{% url 'store:logout' %}">
                                    {% csrf_token %}
                                    <button class="dropdown-item text-danger" type="submit"><i class="bi bi-box-arrow-right me-2"></i>Logout</button>
                                </form>
                            </li>
                        </ul>
                    </div>
                {% else %}
                    <a href="{% url 'store:login' %}" class="btn btn-outline-primary">Login</a>
                    <a href="{% url 'store:register' %}" class="btn btn-primary">Register</a>
                {% endif %}
            </div>
        </div>
    </div>
</nav>
`
  },
  {
    path: 'templates/store/home.html',
    filename: 'home.html',
    category: 'templates',
    description: 'Home page template featuring Hero Carousel, Category Showcase, Featured & Latest Products grid',
    code: `{% extends 'base.html' %}

{% block title %}ShopEase – Modern E-Commerce Store{% endblock %}

{% block content %}
<!-- Hero Section -->
<section class="py-5 bg-gradient-primary text-white position-relative overflow-hidden" style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);">
    <div class="container py-5">
        <div class="row align-items-center">
            <div class="col-lg-6 mb-4 mb-lg-0">
                <span class="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold mb-3">NEW ARRIVALS 2026</span>
                <h1 class="display-4 fw-extrabold mb-3">Elevate Your Everyday Style & Tech</h1>
                <p class="lead mb-4 text-white-50">Discover handcrafted electronics, timeless fashion, and premium accessories tailored for modern living with express delivery.</p>
                <div class="d-flex gap-3">
                    <a href="{% url 'store:shop' %}" class="btn btn-warning btn-lg px-4 fw-bold">Shop All Products</a>
                    <a href="#categories" class="btn btn-outline-light btn-lg px-4">Browse Categories</a>
                </div>
            </div>
            <div class="col-lg-6 text-center">
                <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80" alt="Hero Featured Product" class="img-fluid rounded-4 shadow-lg" style="max-height: 420px; object-fit: cover;">
            </div>
        </div>
    </div>
</section>

<!-- Category Showcase -->
<section id="categories" class="py-5 bg-white">
    <div class="container">
        <div class="d-flex justify-content-between align-items-end mb-4">
            <div>
                <h2 class="fw-bold mb-1">Shop by Category</h2>
                <p class="text-muted mb-0">Browse through our curated collection of essentials</p>
            </div>
            <a href="{% url 'store:shop' %}" class="btn btn-link text-decoration-none fw-semibold">View All &rarr;</a>
        </div>
        <div class="row g-4">
            {% for cat in categories %}
                <div class="col-6 col-md-4 col-lg-2">
                    <a href="{% url 'store:category_products' cat.slug %}" class="card text-center border-0 shadow-sm h-100 hover-lift text-decoration-none text-dark p-3">
                        <img src="{{ cat.image.url|default:'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=300&q=80' }}" class="rounded-circle mx-auto mb-3" style="width: 80px; height: 80px; object-fit: cover;">
                        <h6 class="fw-bold mb-1">{{ cat.name }}</h6>
                    </a>
                </div>
            {% endfor %}
        </div>
    </div>
</section>

<!-- Featured Products -->
<section class="py-5">
    <div class="container">
        <div class="d-flex justify-content-between align-items-end mb-4">
            <div>
                <h2 class="fw-bold mb-1">Featured Products</h2>
                <p class="text-muted mb-0">Top picked deals with unbeatable value</p>
            </div>
            <a href="{% url 'store:shop' %}" class="btn btn-link text-decoration-none fw-semibold">Explore Shop &rarr;</a>
        </div>
        <div class="row g-4">
            {% for product in featured_products %}
                <div class="col-6 col-md-4 col-lg-3">
                    <div class="card h-100 product-card shadow-sm border-0 position-relative">
                        {% if product.discount_percent > 0 %}
                            <span class="badge bg-danger position-absolute top-0 start-0 m-3">-{{ product.discount_percent }}%</span>
                        {% endif %}
                        <a href="{{ product.get_absolute_url }}">
                            <img src="{{ product.image.url }}" class="card-img-top p-3" alt="{{ product.name }}" style="height: 220px; object-fit: contain;">
                        </a>
                        <div class="card-body d-flex flex-column">
                            <span class="text-muted small mb-1">{{ product.category.name }}</span>
                            <h6 class="card-title fw-semibold mb-2">
                                <a href="{{ product.get_absolute_url }}" class="text-dark text-decoration-none text-truncate-2">{{ product.name }}</a>
                            </h6>
                            <div class="d-flex align-items-center mb-2">
                                <span class="text-warning small me-1"><i class="bi bi-star-fill"></i> {{ product.rating }}</span>
                                <span class="text-muted small">({{ product.review_count }})</span>
                            </div>
                            <div class="mt-auto d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="fw-bold fs-5 text-primary">\${{ product.current_price }}</span>
                                    {% if product.discount_price %}
                                        <del class="text-muted small ms-1">\${{ product.price }}</del>
                                    {% endif %}
                                </div>
                                <form action="{% url 'store:add_to_cart' product.id %}" method="POST">
                                    {% csrf_token %}
                                    <button type="submit" class="btn btn-outline-primary btn-sm rounded-circle" title="Add to Cart">
                                        <i class="bi bi-cart-plus"></i>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            {% endfor %}
        </div>
    </div>
</section>
{% endblock %}
`
  },
  {
    path: 'templates/store/cart.html',
    filename: 'cart.html',
    category: 'templates',
    description: 'Shopping cart template with quantity modifier controls, subtotal, tax, and checkout CTA',
    code: `{% extends 'base.html' %}

{% block title %}Your Shopping Cart – ShopEase{% endblock %}

{% block content %}
<div class="container py-5">
    <h2 class="fw-bold mb-4">Shopping Cart</h2>
    {% if items %}
        <div class="row g-4">
            <div class="col-lg-8">
                <div class="card border-0 shadow-sm">
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table align-middle mb-0">
                                <thead class="table-light">
                                    <tr>
                                        <th class="ps-4">Product</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Subtotal</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {% for item in items %}
                                        <tr>
                                            <td class="ps-4">
                                                <div class="d-flex align-items-center gap-3">
                                                    <img src="{{ item.product.image.url }}" class="rounded border" style="width: 60px; height: 60px; object-fit: contain;">
                                                    <div>
                                                        <h6 class="mb-0 fw-semibold">{{ item.product.name }}</h6>
                                                        <small class="text-muted">{{ item.product.category.name }}</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>\${{ item.product.current_price }}</td>
                                            <td>
                                                <form action="{% url 'store:update_cart' item.id %}" method="POST" class="d-flex align-items-center gap-1">
                                                    {% csrf_token %}
                                                    <button type="submit" name="action" value="decrease" class="btn btn-sm btn-outline-secondary px-2">-</button>
                                                    <span class="px-2 fw-semibold">{{ item.quantity }}</span>
                                                    <button type="submit" name="action" value="increase" class="btn btn-sm btn-outline-secondary px-2">+</button>
                                                </form>
                                            </td>
                                            <td class="fw-bold text-primary">\${{ item.total_price }}</td>
                                            <td>
                                                <form action="{% url 'store:update_cart' item.id %}" method="POST">
                                                    {% csrf_token %}
                                                    <input type="hidden" name="action" value="remove">
                                                    <button type="submit" class="btn btn-link text-danger p-0" title="Remove"><i class="bi bi-trash fs-5"></i></button>
                                                </form>
                                            </td>
                                        </tr>
                                    {% endfor %}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="mt-3">
                    <a href="{% url 'store:shop' %}" class="btn btn-outline-primary">&larr; Continue Shopping</a>
                </div>
            </div>

            <!-- Order Summary -->
            <div class="col-lg-4">
                <div class="card border-0 shadow-sm p-4">
                    <h5 class="fw-bold mb-3">Order Summary</h5>
                    <div class="d-flex justify-content-between mb-2">
                        <span class="text-muted">Subtotal</span>
                        <span class="fw-semibold">\${{ subtotal }}</span>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <span class="text-muted">Estimated Shipping</span>
                        <span class="fw-semibold">{% if shipping == 0 %}FREE{% else %}\${{ shipping }}{% endif %}</span>
                    </div>
                    <div class="d-flex justify-content-between mb-3">
                        <span class="text-muted">Estimated Tax</span>
                        <span class="fw-semibold">\${{ tax }}</span>
                    </div>
                    <hr>
                    <div class="d-flex justify-content-between mb-4">
                        <span class="fw-bold fs-5">Total</span>
                        <span class="fw-bold fs-5 text-primary">\${{ total }}</span>
                    </div>
                    <a href="{% url 'store:checkout' %}" class="btn btn-primary btn-lg w-100 fw-bold">Proceed to Checkout</a>
                </div>
            </div>
        </div>
    {% else %}
        <div class="text-center py-5">
            <i class="bi bi-cart-x text-muted display-1"></i>
            <h4 class="mt-3 fw-bold">Your Cart is Empty</h4>
            <p class="text-muted">Explore our catalog and find the products you love.</p>
            <a href="{% url 'store:shop' %}" class="btn btn-primary px-4 mt-2">Start Shopping</a>
        </div>
    {% endif %}
</div>
{% endblock %}
`
  },
  {
    path: 'static/css/style.css',
    filename: 'style.css',
    category: 'static',
    description: 'Custom CSS enhancements for cards, hover transitions, and badge styling',
    code: `/* Custom ShopEase Stylesheet */
.product-card {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    border-radius: 12px;
}

.product-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.08) !important;
}

.hover-lift {
    transition: transform 0.2s ease;
}

.hover-lift:hover {
    transform: translateY(-3px);
}

.text-truncate-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.hero-banner {
    background-size: cover;
    background-position: center;
}
`
  },
  {
    path: 'schema.sql',
    filename: 'schema.sql',
    category: 'config',
    description: 'MySQL database initialization script and table schema definitions',
    code: `-- ==========================================
-- ShopEase E-Commerce Store MySQL Schema
-- ==========================================

CREATE DATABASE IF NOT EXISTS \`shopease_db\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`shopease_db\`;

-- Categories Table
CREATE TABLE IF NOT EXISTS \`store_category\` (
    \`id\` BIGINT AUTO_INCREMENT PRIMARY KEY,
    \`name\` VARCHAR(100) NOT NULL UNIQUE,
    \`slug\` VARCHAR(120) NOT NULL UNIQUE,
    \`description\` LONGTEXT NULL,
    \`image\` VARCHAR(100) NULL,
    \`created_at\` DATETIME(6) NOT NULL
);

-- Products Table
CREATE TABLE IF NOT EXISTS \`store_product\` (
    \`id\` BIGINT AUTO_INCREMENT PRIMARY KEY,
    \`name\` VARCHAR(255) NOT NULL,
    \`slug\` VARCHAR(280) NOT NULL UNIQUE,
    \`sku\` VARCHAR(50) NOT NULL UNIQUE,
    \`description\` LONGTEXT NOT NULL,
    \`price\` DECIMAL(10,2) NOT NULL,
    \`discount_price\` DECIMAL(10,2) NULL,
    \`image\` VARCHAR(100) NOT NULL,
    \`stock\` INT UNSIGNED NOT NULL DEFAULT 10,
    \`rating\` DECIMAL(3,1) NOT NULL DEFAULT 5.0,
    \`review_count\` INT UNSIGNED NOT NULL DEFAULT 0,
    \`is_featured\` TINYINT(1) NOT NULL DEFAULT 0,
    \`is_latest\` TINYINT(1) NOT NULL DEFAULT 1,
    \`created_at\` DATETIME(6) NOT NULL,
    \`updated_at\` DATETIME(6) NOT NULL,
    \`category_id\` BIGINT NOT NULL,
    FOREIGN KEY (\`category_id\`) REFERENCES \`store_category\`(\`id\`) ON DELETE CASCADE
);

-- Orders Table
CREATE TABLE IF NOT EXISTS \`store_order\` (
    \`id\` BIGINT AUTO_INCREMENT PRIMARY KEY,
    \`order_number\` VARCHAR(50) NOT NULL UNIQUE,
    \`full_name\` VARCHAR(150) NOT NULL,
    \`email\` VARCHAR(254) NOT NULL,
    \`phone\` VARCHAR(20) NOT NULL,
    \`address\` VARCHAR(255) NOT NULL,
    \`city\` VARCHAR(100) NOT NULL,
    \`state\` VARCHAR(100) NULL,
    \`postal_code\` VARCHAR(20) NOT NULL,
    \`country\` VARCHAR(100) NOT NULL,
    \`payment_method\` VARCHAR(20) NOT NULL,
    \`status\` VARCHAR(20) NOT NULL,
    \`subtotal\` DECIMAL(10,2) NOT NULL,
    \`discount\` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    \`shipping\` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    \`tax\` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    \`total_amount\` DECIMAL(10,2) NOT NULL,
    \`created_at\` DATETIME(6) NOT NULL,
    \`updated_at\` DATETIME(6) NOT NULL,
    \`user_id\` INT NULL,
    FOREIGN KEY (\`user_id\`) REFERENCES \`auth_user\`(\`id\`) ON DELETE SET NULL
);
`
  }
];

export const DJANGO_SETUP_STEPS = [
  {
    step: 1,
    title: 'Create Virtual Environment',
    command: 'python -m venv venv\n# On Linux/macOS:\nsource venv/bin/activate\n# On Windows (cmd):\nvenv\\Scripts\\activate.bat\n# On Windows (PowerShell):\nvenv\\Scripts\\Activate.ps1',
    description: 'Isolate dependencies for the ShopEase project in a clean environment.'
  },
  {
    step: 2,
    title: 'Install Django & MySQL Dependencies',
    command: 'pip install -r requirements.txt',
    description: 'Installs Django, mysqlclient, Pillow (for image uploads), and crispy-forms.'
  },
  {
    step: 3,
    title: 'Create MySQL Database',
    command: 'mysql -u root -p\nCREATE DATABASE shopease_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\nEXIT;',
    description: 'Prepare the dedicated database in your local or remote MySQL server.'
  },
  {
    step: 4,
    title: 'Apply Database Migrations',
    command: 'python manage.py makemigrations store\npython manage.py migrate',
    description: 'Translates Django ORM models (Category, Product, Cart, Order, Profile) into MySQL tables.'
  },
  {
    step: 5,
    title: 'Create Superuser (Admin)',
    command: 'python manage.py createsuperuser',
    description: 'Follow prompts to set up your username, email, and password to access the Django Admin Portal.'
  },
  {
    step: 6,
    title: 'Run Development Server',
    command: 'python manage.py runserver',
    description: 'Access the store at http://127.0.0.1:8000/ and the admin panel at http://127.0.0.1:8000/admin/'
  }
];
