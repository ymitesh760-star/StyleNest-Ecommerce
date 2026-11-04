import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp, Package, ShoppingCart, DollarSign, Plus, Edit,
  Trash2, Eye, ShieldCheck, Check, AlertTriangle, ArrowUpRight, Search, Sparkles,
  Truck, RotateCcw, Printer, Phone, Mail, MapPin, RefreshCw, X, Filter, Clock,
  Users, Upload, Image as ImageIcon, Star, Flame, Award, CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { Product, Order, OrderStatus, UserProfile } from '../types';
import { useToast } from '../context/ToastContext';
import {
  getAllOrders,
  updateOrderStatus as firestoreUpdateOrderStatus,
  processOrderRefund
} from '../services/orderService';
import { getAllUsers } from '../services/userService';
import { uploadProductImage } from '../services/productService';
import { validateImageUrl, sanitizeImageUrl, FALLBACK_IMAGES } from '../utils/imageUtils';
import { LuxuryImage } from '../components/common/LuxuryImage';

export const Admin: React.FC = () => {
  const { user, isAdmin, logout, isFirebaseConnected, orders } = useAuth();
  const {
    products: productList,
    createOrUpdateProduct,
    removeProduct,
    seedCatalogToFirestore,
    isFirestoreActive
  } = useProducts();
  const toast = useToast();

  React.useEffect(() => {
    document.title = 'STYLENEST × DRIPPY | Store Director Portal';
    window.scrollTo(0, 0);
  }, []);

  // Admin Tab State
  const [activeAdminTab, setActiveAdminTab] = useState<'dashboard' | 'orders' | 'catalog' | 'customers' | 'returns'>('dashboard');

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Orders State
  const [allOrders, setAllOrders] = useState<Order[]>(orders);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  // Customers State
  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [viewingCustomerOrders, setViewingCustomerOrders] = useState<{ email: string; name: string } | null>(null);

  // Seeding State
  const [isSeeding, setIsSeeding] = useState(false);

  // Add / Edit Product Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Product Form Fields
  const [formName, setFormName] = useState('');
  const [formBrand, setFormBrand] = useState('STYLENEST × DRIPPY');
  const [formSku, setFormSku] = useState('');
  const [formCategory, setFormCategory] = useState<'men' | 'women' | 'shoes' | 'perfumes'>('men');
  const [formSubcategory, setFormSubcategory] = useState('Jackets');
  const [formPrice, setFormPrice] = useState(5999);
  const [formOriginalPrice, setFormOriginalPrice] = useState<number | undefined>(undefined);
  const [formStock, setFormStock] = useState(15);
  const [formInStock, setFormInStock] = useState(true);
  const [formImages, setFormImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [formDescription, setFormDescription] = useState('');
  const [formSizesInput, setFormSizesInput] = useState('S, M, L, XL');
  const [formColorsInput, setFormColorsInput] = useState('Black, Camel, Charcoal');
  const [formIsNewArrival, setFormIsNewArrival] = useState(true);
  const [formIsBestseller, setFormIsBestseller] = useState(false);
  const [formIsTrending, setFormIsTrending] = useState(false);

  // Order Inspection & Dispatch Modal
  const [viewingOrderModal, setViewingOrderModal] = useState<Order | null>(null);
  const [courierPartnerInput, setCourierPartnerInput] = useState('BlueDart Apex Air Express');
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const [isSavingShipment, setIsSavingShipment] = useState(false);

  // Fetch all orders across Firestore
  const fetchLiveOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const live = await getAllOrders();
      if (live && live.length > 0) {
        setAllOrders(live);
      } else {
        setAllOrders(orders);
      }
    } catch {
      setAllOrders(orders);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  // Fetch registered users from Firestore
  const fetchLiveUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const usersList = await getAllUsers();
      setRegisteredUsers(usersList);
    } catch {
      setRegisteredUsers([]);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchLiveOrders();
    fetchLiveUsers();
  }, [orders]);

  // Calculate Metrics
  const totalRevenue = allOrders.reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = allOrders.length;
  const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;
  const totalInventoryUnits = productList.reduce((sum, p) => sum + p.stockCount, 0);
  const lowStockProducts = productList.filter((p) => p.stockCount <= 5);

  // Aggregate Unique Customers (from registered profiles + orders)
  const aggregatedCustomers = React.useMemo(() => {
    const map = new Map<string, {
      id: string;
      name: string;
      email: string;
      phone: string;
      ordersCount: number;
      totalSpent: number;
      joinedDate: string;
    }>();

    // From registered profiles
    registeredUsers.forEach((u) => {
      map.set(u.email.toLowerCase(), {
        id: u.id,
        name: u.name || 'Client',
        email: u.email,
        phone: u.phone || (u.addresses?.[0]?.phone || '—'),
        ordersCount: 0,
        totalSpent: 0,
        joinedDate: 'Registered User',
      });
    });

    // From orders
    allOrders.forEach((o) => {
      const email = (o.shippingAddress?.email || 'guest@stylenest.com').toLowerCase();
      const existing = map.get(email);
      if (existing) {
        existing.ordersCount += 1;
        existing.totalSpent += o.total;
        if (!existing.phone || existing.phone === '—') {
          existing.phone = o.shippingAddress?.phone || '—';
        }
      } else {
        map.set(email, {
          id: `order-client-${email}`,
          name: o.shippingAddress?.fullName || 'Client',
          email: o.shippingAddress?.email || email,
          phone: o.shippingAddress?.phone || '—',
          ordersCount: 1,
          totalSpent: o.total,
          joinedDate: new Date(o.createdAt).toLocaleDateString('en-IN'),
        });
      }
    });

    return Array.from(map.values());
  }, [registeredUsers, allOrders]);

  // Filtered Products
  const filteredProducts = productList.filter((p) => {
    const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
    const matchQ =
      !searchTerm ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.subcategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchCat && matchQ;
  });

  // Filtered Orders
  const filteredOrders = allOrders.filter((o) => {
    const matchStatus = orderStatusFilter === 'all' || o.orderStatus === orderStatusFilter;
    const q = orderSearchQuery.toLowerCase();
    const matchQ =
      !q ||
      o.id.toLowerCase().includes(q) ||
      o.orderNumber.toLowerCase().includes(q) ||
      o.shippingAddress.fullName.toLowerCase().includes(q) ||
      o.shippingAddress.email.toLowerCase().includes(q) ||
      o.shippingAddress.phone.includes(q);
    return matchStatus && matchQ;
  });

  // Open Order Inspection Modal
  const handleOpenOrderModal = (order: Order) => {
    setViewingOrderModal(order);
    setCourierPartnerInput(order.courierPartner || 'BlueDart Apex Air Express');
    setTrackingNumberInput(order.trackingNumber || `BLUEDART-IND-${Math.floor(1000000 + Math.random() * 9000000)}`);
  };

  // Open Modal for New Product
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormBrand('STYLENEST × DRIPPY');
    setFormSku(`SND-${Math.floor(100 + Math.random() * 900)}`);
    setFormCategory('men');
    setFormSubcategory('Jackets');
    setFormPrice(5999);
    setFormOriginalPrice(7499);
    setFormStock(15);
    setFormInStock(true);
    setFormImages(['https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=1000&q=80']);
    setFormDescription('Architectural creation hand-tailored in our Parisian atelier.');
    setFormSizesInput('S, M, L, XL');
    setFormColorsInput('Black, Camel, Charcoal');
    setFormIsNewArrival(true);
    setFormIsBestseller(false);
    setFormIsTrending(false);
    setIsModalOpen(true);
  };

  // Open Modal for Edit Product
  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormBrand(p.brand || 'StyleNest Studio Paris');
    setFormSku(p.sku || `SN-${p.id.toUpperCase()}`);
    setFormCategory(p.category);
    setFormSubcategory(p.subcategory);
    setFormPrice(p.price);
    setFormOriginalPrice(p.originalPrice);
    setFormStock(p.stockCount);
    setFormInStock(p.inStock);
    setFormImages(p.images && p.images.length > 0 ? [...p.images] : ['https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=1000&q=80']);
    setFormDescription(p.description);
    setFormSizesInput(p.sizes ? p.sizes.join(', ') : 'S, M, L, XL');
    setFormColorsInput(p.colors ? p.colors.map(c => c.name).join(', ') : 'Black, Navy');
    setFormIsNewArrival(Boolean(p.isNewArrival));
    setFormIsBestseller(Boolean(p.isBestseller));
    setFormIsTrending(Boolean(p.isTrending));
    setIsModalOpen(true);
  };

  // Handle Image File Upload (Multiple or Single)
  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingImage(true);
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const url = await uploadProductImage(files[i]);
        uploadedUrls.push(url);
      }
      setFormImages((prev) => [...prev, ...uploadedUrls]);
      toast.success('Image Uploaded', `${uploadedUrls.length} image(s) processed successfully.`);
    } catch (err: any) {
      toast.error('Upload Error', err?.message || 'Failed to upload image.');
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  };

  // Add Image URL with validation
  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    const validation = validateImageUrl(newImageUrl);
    if (!validation.isValid) {
      toast.error('Invalid Image URL', validation.warning || 'Please enter a valid image URL');
      return;
    }
    setFormImages((prev) => [...prev, validation.sanitizedUrl]);
    setNewImageUrl('');
  };

  // Remove Image from Form
  const handleRemoveImage = (index: number) => {
    setFormImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Save Product (Add or Edit)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    let activeImages = [...formImages];
    // If user typed/pasted a URL in the input but forgot to click "+ Add", automatically validate and include it
    if (newImageUrl.trim()) {
      const validation = validateImageUrl(newImageUrl);
      if (validation.isValid && !activeImages.includes(validation.sanitizedUrl)) {
        activeImages.push(validation.sanitizedUrl);
        setNewImageUrl('');
      } else if (!validation.isValid && activeImages.length === 0) {
        toast.error('Invalid Image URL', validation.warning || 'Please provide a valid direct image URL.');
        return;
      }
    }

    if (activeImages.length === 0) {
      toast.error('Image Required', 'Please provide at least one product image URL or upload an image file.');
      return;
    }

    const sizes = formSizesInput.split(',').map((s) => s.trim()).filter(Boolean);
    const colors = formColorsInput.split(',').map((c) => ({
      name: c.trim(),
      hex: '#171717',
    })).filter((c) => Boolean(c.name));

    const badges: ('New' | 'Bestseller' | 'Sale')[] = [];
    if (formIsNewArrival) badges.push('New');
    if (formIsBestseller) badges.push('Bestseller');
    if (formOriginalPrice && formOriginalPrice > formPrice) badges.push('Sale');

    const primaryImage = activeImages[0];

    if (editingProduct) {
      const updated: Product = {
        ...editingProduct,
        name: formName,
        brand: formBrand,
        sku: formSku,
        category: formCategory,
        subcategory: formSubcategory,
        price: formPrice,
        originalPrice: formOriginalPrice,
        stockCount: formStock,
        inStock: formInStock && formStock > 0,
        images: activeImages,
        image: primaryImage,
        imageUrl: primaryImage,
        thumbnail: primaryImage,
        description: formDescription,
        sizes: sizes.length > 0 ? sizes : undefined,
        colors: colors.length > 0 ? colors : undefined,
        badges,
        isNewArrival: formIsNewArrival,
        isBestseller: formIsBestseller,
        isTrending: formIsTrending,
      };
      await createOrUpdateProduct(updated);
      toast.success('Product Updated', `${formName} has been revised successfully.`);
    } else {
      const newProd: Product = {
        id: `prod-${Date.now()}`,
        name: formName,
        brand: formBrand,
        sku: formSku,
        category: formCategory,
        subcategory: formSubcategory,
        price: formPrice,
        originalPrice: formOriginalPrice,
        rating: 5.0,
        reviewsCount: 1,
        images: activeImages,
        image: primaryImage,
        imageUrl: primaryImage,
        thumbnail: primaryImage,
        description: formDescription,
        inStock: formInStock && formStock > 0,
        stockCount: formStock,
        sizes: sizes.length > 0 ? sizes : undefined,
        colors: colors.length > 0 ? colors : undefined,
        badges,
        isNewArrival: formIsNewArrival,
        isBestseller: formIsBestseller,
        isTrending: formIsTrending,
        createdAt: new Date().toISOString(),
      };
      await createOrUpdateProduct(newProd);
      toast.luxury('Creation Published', `${formName} added to the boutique catalog.`);
    }

    setIsModalOpen(false);
  };

  // Delete Product
  const handleDeleteProduct = async (id: string, name: string) => {
    if (confirm(`Are you sure you wish to decommission "${name}" from the boutique catalog?`)) {
      await removeProduct(id);
      toast.info('Product Removed', `${name} has been removed from catalog.`);
    }
  };

  // Quick Restock Product (+10 units)
  const handleQuickRestock = async (product: Product) => {
    const updated: Product = {
      ...product,
      stockCount: product.stockCount + 10,
      inStock: true,
    };
    await createOrUpdateProduct(updated);
    toast.success('Stock Replenished', `${product.name} stock increased to ${updated.stockCount} units.`);
  };

  // Sync / Seed Catalog to Firestore
  const handleSeedCatalog = async () => {
    setIsSeeding(true);
    try {
      const res = await seedCatalogToFirestore();
      toast.luxury('Catalog Synced', res.message);
    } catch (e: any) {
      toast.error('Sync Failed', e?.message || 'Could not sync products to Firestore');
    } finally {
      setIsSeeding(false);
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (
    orderId: string,
    newStatus: OrderStatus,
    tracking?: string,
    courier?: string
  ) => {
    setIsSavingShipment(true);
    try {
      await firestoreUpdateOrderStatus(orderId, newStatus, tracking, courier);
      setAllOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                orderStatus: newStatus,
                trackingNumber: tracking || o.trackingNumber,
                courierPartner: courier || o.courierPartner,
              }
            : o
        )
      );

      if (viewingOrderModal && viewingOrderModal.id === orderId) {
        setViewingOrderModal({
          ...viewingOrderModal,
          orderStatus: newStatus,
          trackingNumber: tracking || viewingOrderModal.trackingNumber,
          courierPartner: courier || viewingOrderModal.courierPartner,
        });
      }

      toast.success('Status Updated', `Order #${orderId} marked as ${newStatus}.`);
    } catch (e: any) {
      toast.error('Update Failed', e?.message || 'Could not update order status.');
    } finally {
      setIsSavingShipment(false);
    }
  };

  // Approve Refund
  const handleApproveRefund = async (orderId: string, amount: number) => {
    if (!confirm(`Are you sure you want to approve this return and mark ₹${amount.toLocaleString('en-IN')} as REFUNDED?`)) {
      return;
    }

    try {
      await processOrderRefund(orderId, amount);
      setAllOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, orderStatus: 'Refunded', returnStatus: 'Refunded', paymentStatus: 'Refunded', refundAmount: amount }
            : o
        )
      );
      if (viewingOrderModal && viewingOrderModal.id === orderId) {
        setViewingOrderModal({
          ...viewingOrderModal,
          orderStatus: 'Refunded',
          returnStatus: 'Refunded',
          paymentStatus: 'Refunded',
          refundAmount: amount
        });
      }
      toast.luxury('Refund Completed', `Order #${orderId} marked as REFUNDED for ₹${amount.toLocaleString('en-IN')}.`);
    } catch (e: any) {
      toast.error('Refund Error', e?.message || 'Failed to process refund.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 lg:py-16 pb-28 font-sans">
      {/* Top Portal Masthead */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-black/10 mb-8 gap-4">
        <div>
          <span className="text-[10px] uppercase font-mono font-bold tracking-[0.25em] text-[#B99A6B] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#B99A6B]" />
            <span>STYLENEST × DRIPPY • Director Atelier Operations</span>
          </span>
          <h1 className="font-sans font-black text-3xl sm:text-4xl uppercase tracking-tight text-[#0A0A0A] mt-1">
            Store Director Dashboard
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-neutral-100 border border-black/10 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-mono text-[11px] text-neutral-800 font-medium truncate max-w-[170px]" title={user?.email || 'Store Director'}>
              {user?.email || 'Store Director'}
            </span>
            <button
              type="button"
              onClick={() => logout()}
              className="ml-1 text-[11px] text-rose-700 hover:text-rose-900 font-semibold underline uppercase tracking-wider"
              title="Sign Out of Store Director session"
            >
              Sign Out
            </button>
          </div>

          <button
            onClick={handleSeedCatalog}
            disabled={isSeeding}
            className="px-4 py-2.5 bg-white border border-black/20 hover:border-black text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
            title="Sync products to Firestore collection 'products'"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#B99A6B]" />
            <span>{isSeeding ? 'Syncing...' : 'Sync Catalog to Firestore'}</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="px-5 py-2.5 bg-[#0A0A0A] hover:bg-[#262626] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 border border-[#B99A6B]/30"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Creation</span>
          </button>

          <Link
            to="/"
            className="px-4 py-2.5 bg-transparent border border-black/20 hover:border-black text-xs font-bold uppercase tracking-wider text-[#0A0A0A] transition-colors"
          >
            View Live Store
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
        <div className="p-6 bg-white border border-black/10 shadow-sm space-y-1">
          <div className="flex justify-between items-center text-neutral-400">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider">Gross Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="font-sans font-black text-2xl sm:text-3xl text-[#0A0A0A]">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-emerald-700 font-medium">All logged transactions</p>
        </div>

        <div className="p-6 bg-white border border-black/10 shadow-sm space-y-1">
          <div className="flex justify-between items-center text-neutral-400">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider">Total Orders</span>
            <ShoppingCart className="w-4 h-4 text-[#B99A6B]" />
          </div>
          <p className="font-sans font-black text-2xl sm:text-3xl text-[#0A0A0A]">
            {totalOrdersCount}
          </p>
          <p className="text-[11px] text-neutral-500 font-medium">Avg Value: ₹{avgOrderValue.toLocaleString('en-IN')}</p>
        </div>

        <div className="p-6 bg-white border border-black/10 shadow-sm space-y-1">
          <div className="flex justify-between items-center text-neutral-400">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider">Total Customers</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <p className="font-sans font-black text-2xl sm:text-3xl text-[#0A0A0A]">
            {aggregatedCustomers.length}
          </p>
          <p className="text-[11px] text-neutral-500 font-medium">Registered & buyers</p>
        </div>

        <div className="p-6 bg-white border border-black/10 shadow-sm space-y-1">
          <div className="flex justify-between items-center text-neutral-400">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider">Catalog Inventory</span>
            <Package className="w-4 h-4 text-purple-600" />
          </div>
          <p className="font-sans font-black text-2xl sm:text-3xl text-[#0A0A0A]">
            {productList.length} items
          </p>
          <p className="text-[11px] text-neutral-500 font-medium">{totalInventoryUnits} units in stock</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-black/10 mb-8 space-x-6 text-xs uppercase tracking-wider font-bold overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveAdminTab('dashboard')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors shrink-0 ${
            activeAdminTab === 'dashboard'
              ? 'border-[#0A0A0A] text-[#0A0A0A]'
              : 'border-transparent text-neutral-400 hover:text-[#0A0A0A]'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-[#B99A6B]" />
          <span>Dashboard Overview</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('orders')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors shrink-0 ${
            activeAdminTab === 'orders'
              ? 'border-[#0A0A0A] text-[#0A0A0A]'
              : 'border-transparent text-neutral-400 hover:text-[#0A0A0A]'
          }`}
        >
          <ShoppingCart className="w-4 h-4 text-[#B99A6B]" />
          <span>Orders & Fulfillment ({allOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('catalog')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors shrink-0 ${
            activeAdminTab === 'catalog'
              ? 'border-[#0A0A0A] text-[#0A0A0A]'
              : 'border-transparent text-neutral-400 hover:text-[#0A0A0A]'
          }`}
        >
          <Package className="w-4 h-4 text-[#B99A6B]" />
          <span>Product Catalog ({productList.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('customers')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors shrink-0 ${
            activeAdminTab === 'customers'
              ? 'border-[#0A0A0A] text-[#0A0A0A]'
              : 'border-transparent text-neutral-400 hover:text-[#0A0A0A]'
          }`}
        >
          <Users className="w-4 h-4 text-[#B99A6B]" />
          <span>Customers ({aggregatedCustomers.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('returns')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors shrink-0 ${
            activeAdminTab === 'returns'
              ? 'border-[#0A0A0A] text-[#0A0A0A]'
              : 'border-transparent text-neutral-400 hover:text-[#0A0A0A]'
          }`}
        >
          <RotateCcw className="w-4 h-4 text-[#B99A6B]" />
          <span>Returns & Refunds</span>
          {allOrders.filter((o) => o.orderStatus === 'Return Requested').length > 0 && (
            <span className="px-1.5 py-0.2 bg-amber-500 text-black text-[10px] rounded-full font-bold">
              {allOrders.filter((o) => o.orderStatus === 'Return Requested').length}
            </span>
          )}
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: DASHBOARD OVERVIEW                                */}
      {/* ======================================================== */}
      {activeAdminTab === 'dashboard' && (
        <div className="space-y-8">
          {/* Low Stock Alerts */}
          {lowStockProducts.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 p-6">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-4">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span className="uppercase tracking-wider">Low Stock Inventory Alerts ({lowStockProducts.length} items &le; 5 units)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {lowStockProducts.map((p) => (
                  <div key={p.id} className="bg-white p-3 border border-amber-200 flex items-center justify-between gap-3">
                    <div className="w-10 h-12 bg-neutral-100 overflow-hidden shrink-0 border border-black/10">
                      <LuxuryImage
                        src={p.images?.[0] || p.image || p.imageUrl}
                        alt={p.name}
                        fallbackSrc={FALLBACK_IMAGES[p.category as keyof typeof FALLBACK_IMAGES] || FALLBACK_IMAGES.default}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-xs truncate text-[#0A0A0A]">{p.name}</p>
                      <p className="text-[10px] text-amber-700 font-semibold font-mono">
                        {p.stockCount} unit(s) remaining
                      </p>
                    </div>
                    <button
                      onClick={() => handleQuickRestock(p)}
                      className="px-2.5 py-1 bg-[#0A0A0A] text-white text-[10px] font-bold uppercase tracking-wider shrink-0 hover:bg-neutral-800"
                    >
                      +10 Restock
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Orders Overview */}
          <div className="bg-white border border-black/10 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-black/10 mb-4">
              <h2 className="font-sans font-black text-xl uppercase tracking-tight text-[#0A0A0A]">
                Recent Orders
              </h2>
              <button
                onClick={() => setActiveAdminTab('orders')}
                className="text-xs font-bold uppercase tracking-wider text-[#0A0A0A] hover:underline"
              >
                View All Orders &rarr;
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-black/10 text-neutral-400 uppercase font-mono tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Order #</th>
                    <th className="py-2.5 px-3">Client</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Total</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {allOrders.slice(0, 5).map((o) => (
                    <tr key={o.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-[#0A0A0A]">{o.orderNumber}</td>
                      <td className="py-3 px-3">
                        <p className="font-semibold text-[#0A0A0A]">{o.shippingAddress?.fullName}</p>
                        <p className="text-[10px] text-neutral-400">{o.shippingAddress?.city}</p>
                      </td>
                      <td className="py-3 px-3 text-neutral-500">
                        {new Date(o.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className="py-3 px-3 font-black text-[#0A0A0A]">
                        ₹{o.total.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          o.orderStatus === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : o.orderStatus === 'Shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-neutral-100 text-neutral-800'
                        }`}>
                          {o.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleOpenOrderModal(o)}
                          className="px-2.5 py-1 bg-[#0A0A0A] text-white hover:bg-neutral-800 text-[10px] font-bold uppercase tracking-wider"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: ORDERS & FULFILLMENT                             */}
      {/* ======================================================== */}
      {activeAdminTab === 'orders' && (
        <div className="bg-white border border-black/10 shadow-sm p-6 mb-12 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-black/10 gap-4">
            <div>
              <h2 className="font-sans font-black text-2xl uppercase tracking-tight text-[#0A0A0A]">
                Orders & Fulfillment
              </h2>
              <p className="text-xs text-neutral-500">
                Customer orders from checkout with complete delivery coordinates and courier tracking.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={fetchLiveOrders}
                disabled={isLoadingOrders}
                className="px-3 py-1.5 bg-[#F8F6F2] hover:bg-white border border-black/20 text-xs font-semibold flex items-center gap-1.5 text-[#0A0A0A]"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#B99A6B] ${isLoadingOrders ? 'animate-spin' : ''}`} />
                <span>{isLoadingOrders ? 'Syncing...' : 'Sync Orders'}</span>
              </button>

              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="px-3 py-1.5 border border-black/20 bg-white text-xs font-bold uppercase tracking-wider outline-none"
              >
                <option value="all">All Statuses ({allOrders.length})</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Placed">Placed</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Return Requested">Return Requested</option>
                <option value="Refunded">Refunded</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search order #, client, phone..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 border border-black/20 bg-[#F8F6F2] text-xs outline-none focus:border-black w-60"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-black/10 text-neutral-400 uppercase font-mono tracking-wider text-[10px]">
                  <th className="py-3 px-3">Order ID / Tracking</th>
                  <th className="py-3 px-3">Client & Destination</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Items</th>
                  <th className="py-3 px-3">Total & Mode</th>
                  <th className="py-3 px-3">Update Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="py-3.5 px-3">
                      <span className="font-mono font-bold text-[#0A0A0A] block">{o.orderNumber}</span>
                      <span className="text-[10px] text-neutral-400 font-mono">{o.trackingNumber}</span>
                    </td>

                    <td className="py-3.5 px-3">
                      <p className="font-bold text-[#0A0A0A]">{o.shippingAddress?.fullName}</p>
                      <p className="text-[11px] text-neutral-500">
                        {o.shippingAddress?.city}, {o.shippingAddress?.state} - {o.shippingAddress?.pincode}
                      </p>
                      <p className="text-[10px] text-neutral-400">📞 {o.shippingAddress?.phone}</p>
                    </td>

                    <td className="py-3.5 px-3 text-neutral-500">
                      {new Date(o.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="font-medium text-[#0A0A0A]">{o.items.length} item(s)</span>
                      <div className="flex items-center gap-1 mt-1">
                        {o.items.slice(0, 3).map((it) => (
                          <img
                            key={it.id}
                            src={it.image}
                            alt={it.name}
                            className="w-6 h-8 object-cover border border-black/10"
                          />
                        ))}
                        {o.items.length > 3 && (
                          <span className="text-[9px] text-neutral-400">+{o.items.length - 3}</span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <p className="font-black text-[#0A0A0A] text-sm">
                        ₹{o.total.toLocaleString('en-IN')}
                      </p>
                      <span className="inline-block px-1.5 py-0.2 bg-neutral-100 text-[#0A0A0A] rounded text-[10px] font-bold mt-0.5">
                        {o.paymentMethod} • {o.paymentStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <select
                        value={o.orderStatus}
                        onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as OrderStatus)}
                        className={`border px-2 py-1 text-xs font-bold outline-none cursor-pointer ${
                          o.orderStatus === 'Delivered'
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                            : o.orderStatus === 'Shipped'
                            ? 'bg-blue-50 border-blue-300 text-blue-800'
                            : o.orderStatus === 'Return Requested'
                            ? 'bg-amber-50 border-amber-300 text-amber-900'
                            : o.orderStatus === 'Refunded'
                            ? 'bg-purple-50 border-purple-300 text-purple-900'
                            : 'bg-white border-black/20 text-[#0A0A0A]'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Placed">Placed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Return Requested">Return Requested</option>
                        <option value="Refunded">Refunded</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => handleOpenOrderModal(o)}
                        className="px-2.5 py-1 bg-[#0A0A0A] hover:bg-neutral-800 text-white rounded-none font-bold text-[11px] uppercase tracking-wider transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: PRODUCT CATALOG MANAGEMENT                        */}
      {/* ======================================================== */}
      {activeAdminTab === 'catalog' && (
        <div className="bg-white border border-black/10 shadow-sm p-6 mb-12 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-black/10 gap-4">
            <div>
              <h2 className="font-sans font-black text-2xl uppercase tracking-tight text-[#0A0A0A]">
                Product Catalog Management
              </h2>
              <p className="text-xs text-neutral-500">
                Manage creations, stock levels, variants, multiple images, and catalog availability.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-1.5 border border-black/20 bg-white text-xs font-bold uppercase tracking-wider outline-none"
              >
                <option value="all">All Categories ({productList.length})</option>
                <option value="men">Men's Tailoring</option>
                <option value="shoes">Footwear</option>
                <option value="perfumes">Haute Parfumerie</option>
                <option value="women">Women's Collection</option>
              </select>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search creation, SKU, category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 border border-black/20 bg-[#F8F6F2] text-xs outline-none focus:border-black w-60"
                />
              </div>

              <button
                onClick={handleOpenAddModal}
                className="px-4 py-1.5 bg-[#0A0A0A] hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Product</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-black/10 text-neutral-400 uppercase font-mono tracking-wider text-[10px]">
                  <th className="py-3 px-3">Product</th>
                  <th className="py-3 px-3">SKU / Brand</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Price</th>
                  <th className="py-3 px-3">Stock Units</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 bg-neutral-100 overflow-hidden shrink-0 border border-black/10">
                          <LuxuryImage
                            src={p.images?.[0] || p.image || p.imageUrl}
                            alt={p.name}
                            fallbackSrc={FALLBACK_IMAGES[p.category as keyof typeof FALLBACK_IMAGES] || FALLBACK_IMAGES.default}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-[#0A0A0A]">{p.name}</p>
                          <p className="text-[10px] text-neutral-400">{p.subcategory}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-mono text-[11px] text-neutral-600 block">{p.sku || `SN-${p.id.slice(0, 8)}`}</span>
                      <span className="text-[10px] text-neutral-400">{p.brand}</span>
                    </td>

                    <td className="py-3 px-3">
                      <span className="uppercase text-[10px] font-bold tracking-wider px-2 py-0.5 bg-neutral-100 text-[#0A0A0A]">
                        {p.category}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-bold text-[#0A0A0A]">
                      ₹{p.price.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3 px-3">
                      <span className={`font-mono font-bold ${p.stockCount <= 5 ? 'text-amber-700' : 'text-[#0A0A0A]'}`}>
                        {p.stockCount} units
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                        p.inStock && p.stockCount > 0
                          ? 'bg-emerald-50 text-emerald-800'
                          : 'bg-rose-50 text-rose-800'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${p.inStock && p.stockCount > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        {p.inStock && p.stockCount > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-1.5 hover:bg-neutral-200 text-neutral-700"
                          title="Edit creation"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="p-1.5 hover:bg-rose-100 text-rose-600"
                          title="Delete from catalog"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: CUSTOMER MANAGEMENT                               */}
      {/* ======================================================== */}
      {activeAdminTab === 'customers' && (
        <div className="bg-white border border-black/10 shadow-sm p-6 mb-12 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-black/10 gap-4">
            <div>
              <h2 className="font-sans font-black text-2xl uppercase tracking-tight text-[#0A0A0A]">
                Customer Management ({aggregatedCustomers.length})
              </h2>
              <p className="text-xs text-neutral-500">
                Registered users and purchasing clients from Firestore.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={fetchLiveUsers}
                disabled={isLoadingUsers}
                className="px-3 py-1.5 bg-[#F8F6F2] hover:bg-white border border-black/20 text-xs font-semibold flex items-center gap-1.5 text-[#0A0A0A]"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#B99A6B] ${isLoadingUsers ? 'animate-spin' : ''}`} />
                <span>{isLoadingUsers ? 'Syncing...' : 'Sync Customers'}</span>
              </button>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search client name, email, phone..."
                  value={customerSearchQuery}
                  onChange={(e) => setCustomerSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 border border-black/20 bg-[#F8F6F2] text-xs outline-none focus:border-black w-60"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-black/10 text-neutral-400 uppercase font-mono tracking-wider text-[10px]">
                  <th className="py-3 px-3">Client Profile</th>
                  <th className="py-3 px-3">Contact Email</th>
                  <th className="py-3 px-3">Phone</th>
                  <th className="py-3 px-3">Joined / First Order</th>
                  <th className="py-3 px-3">Total Orders</th>
                  <th className="py-3 px-3">Lifetime Value</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {aggregatedCustomers
                  .filter((c) => {
                    const q = customerSearchQuery.toLowerCase();
                    return !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q);
                  })
                  .map((c) => (
                    <tr key={c.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center font-bold text-xs uppercase">
                            {c.name.charAt(0)}
                          </div>
                          <span className="font-bold text-[#0A0A0A]">{c.name}</span>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-neutral-600 font-mono text-[11px]">{c.email}</td>
                      <td className="py-3 px-3 text-neutral-600">{c.phone}</td>
                      <td className="py-3 px-3 text-neutral-500">{c.joinedDate}</td>

                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 bg-neutral-100 text-[#0A0A0A] font-bold rounded text-[10px]">
                          {c.ordersCount} order(s)
                        </span>
                      </td>

                      <td className="py-3 px-3 font-black text-[#0A0A0A]">
                        ₹{c.totalSpent.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => {
                            setOrderSearchQuery(c.email);
                            setActiveAdminTab('orders');
                          }}
                          className="px-2.5 py-1 bg-white border border-black/20 hover:border-black text-[10px] font-bold uppercase tracking-wider text-[#0A0A0A]"
                        >
                          View Orders
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: RETURNS & REFUNDS                                 */}
      {/* ======================================================== */}
      {activeAdminTab === 'returns' && (
        <div className="bg-white border border-black/10 shadow-sm p-6 mb-12 space-y-6">
          <div className="pb-4 border-b border-black/10">
            <h2 className="font-sans font-black text-2xl uppercase tracking-tight text-[#0A0A0A]">
              14-Day Doorstep Returns & Refunds Portal
            </h2>
            <p className="text-xs text-neutral-500">
              Customer return requests under StyleNest's 100% money-back guarantee.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-black/10 text-neutral-400 uppercase font-mono tracking-wider text-[10px]">
                  <th className="py-3 px-3">Order #</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Return Reason</th>
                  <th className="py-3 px-3">Refund Amount</th>
                  <th className="py-3 px-3">Refund Mode</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Approve Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {allOrders
                  .filter((o) => o.orderStatus === 'Return Requested' || o.orderStatus === 'Refunded')
                  .map((o) => (
                    <tr key={o.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-[#0A0A0A]">{o.orderNumber}</td>
                      <td className="py-3 px-3">
                        <p className="font-bold text-[#0A0A0A]">{o.shippingAddress?.fullName}</p>
                        <p className="text-[10px] text-neutral-400">📞 {o.shippingAddress?.phone}</p>
                      </td>
                      <td className="py-3 px-3 text-neutral-700 italic">
                        {o.returnReason || 'Client requested return under 14-day policy'}
                      </td>
                      <td className="py-3 px-3 font-black text-sm text-[#0A0A0A]">
                        ₹{o.total.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 text-neutral-600 font-semibold">
                        {o.refundMode || 'Original Payment Source'}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                          o.orderStatus === 'Refunded'
                            ? 'bg-purple-100 text-purple-900'
                            : 'bg-amber-100 text-amber-900 animate-pulse'
                        }`}>
                          {o.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {o.orderStatus === 'Refunded' ? (
                          <span className="text-emerald-700 font-bold text-[11px] flex items-center justify-end gap-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>Refund Processed</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => handleApproveRefund(o.id, o.total)}
                            className="px-3 py-1 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-[10px] uppercase tracking-wider transition-colors"
                          >
                            Approve Refund (₹{o.total})
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ADD / EDIT PRODUCT MODAL (With Multiple Image Uploads)   */}
      {/* ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-none max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-black/20 max-h-[92vh] overflow-y-auto space-y-5 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-black/10">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-[#B99A6B] uppercase">
                  Product Inventory Management
                </span>
                <h3 className="font-sans font-black text-xl uppercase tracking-tight text-[#0A0A0A] mt-0.5">
                  {editingProduct ? 'Edit Creation' : 'Add New Creation'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 uppercase tracking-wider text-[10px] text-neutral-500">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Double-Faced Cashmere Overcoat"
                    className="w-full bg-[#F8F6F2] border border-black/20 p-2.5 text-xs text-[#0A0A0A] outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 uppercase tracking-wider text-[10px] text-neutral-500">
                    Brand *
                  </label>
                  <input
                    type="text"
                    required
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    placeholder="STYLENEST × DRIPPY"
                    className="w-full bg-[#F8F6F2] border border-black/20 p-2.5 text-xs text-[#0A0A0A] outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold mb-1 uppercase tracking-wider text-[10px] text-neutral-500">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    placeholder="SN-PARIS-001"
                    className="w-full bg-[#F8F6F2] border border-black/20 p-2.5 text-xs text-[#0A0A0A] outline-none focus:border-black font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 uppercase tracking-wider text-[10px] text-neutral-500">
                    Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full bg-[#F8F6F2] border border-black/20 p-2.5 text-xs text-[#0A0A0A] outline-none focus:border-black font-bold uppercase"
                  >
                    <option value="men">Menswear</option>
                    <option value="shoes">Footwear</option>
                    <option value="perfumes">Haute Parfumerie</option>
                    <option value="women">Women's Collection</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1 uppercase tracking-wider text-[10px] text-neutral-500">
                    Subcategory *
                  </label>
                  <input
                    type="text"
                    required
                    value={formSubcategory}
                    onChange={(e) => setFormSubcategory(e.target.value)}
                    placeholder="Jackets, Boots, Extrait..."
                    className="w-full bg-[#F8F6F2] border border-black/20 p-2.5 text-xs text-[#0A0A0A] outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold mb-1 uppercase tracking-wider text-[10px] text-neutral-500">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={100}
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full bg-[#F8F6F2] border border-black/20 p-2.5 text-xs text-[#0A0A0A] outline-none focus:border-black font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 uppercase tracking-wider text-[10px] text-neutral-500">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    value={formOriginalPrice || ''}
                    onChange={(e) => setFormOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Strike-through"
                    className="w-full bg-[#F8F6F2] border border-black/20 p-2.5 text-xs text-[#0A0A0A] outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 uppercase tracking-wider text-[10px] text-neutral-500">
                    Stock Units *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    className="w-full bg-[#F8F6F2] border border-black/20 p-2.5 text-xs text-[#0A0A0A] outline-none focus:border-black font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 uppercase tracking-wider text-[10px] text-neutral-500">
                    Availability
                  </label>
                  <label className="flex items-center gap-2 p-2.5 bg-[#F8F6F2] border border-black/20 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formInStock}
                      onChange={(e) => setFormInStock(e.target.checked)}
                      className="rounded-none text-black"
                    />
                    <span className="text-[11px] font-bold uppercase">{formInStock ? 'In Stock' : 'Hidden'}</span>
                  </label>
                </div>
              </div>

              {/* Variants: Sizes & Colors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 uppercase tracking-wider text-[10px] text-neutral-500">
                    Sizes (Comma-Separated)
                  </label>
                  <input
                    type="text"
                    value={formSizesInput}
                    onChange={(e) => setFormSizesInput(e.target.value)}
                    placeholder="S, M, L, XL or UK 7, UK 8, UK 9"
                    className="w-full bg-[#F8F6F2] border border-black/20 p-2.5 text-xs text-[#0A0A0A] outline-none focus:border-black font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 uppercase tracking-wider text-[10px] text-neutral-500">
                    Colors (Comma-Separated)
                  </label>
                  <input
                    type="text"
                    value={formColorsInput}
                    onChange={(e) => setFormColorsInput(e.target.value)}
                    placeholder="Black, Camel, Charcoal, Ivory"
                    className="w-full bg-[#F8F6F2] border border-black/20 p-2.5 text-xs text-[#0A0A0A] outline-none focus:border-black"
                  />
                </div>
              </div>

              {/* Multiple Images Management */}
              <div className="space-y-2 pt-2 border-t border-black/10">
                <label className="block font-bold uppercase tracking-wider text-[10px] text-neutral-500">
                  Product Images ({formImages.length}) *
                </label>

                {/* Upload from Computer or Add URL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <label className="flex items-center justify-center gap-2 p-3 bg-white border border-dashed border-black/30 hover:border-black cursor-pointer text-xs font-bold uppercase tracking-wider transition-colors">
                    <Upload className="w-4 h-4 text-[#B99A6B]" />
                    <span>{isUploadingImage ? 'Uploading Image...' : 'Upload Image File'}</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                      disabled={isUploadingImage}
                    />
                  </label>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex">
                      <input
                        type="url"
                        placeholder="Paste image URL (HTTPS, Unsplash, WebP, PNG)..."
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        className="flex-1 bg-[#F8F6F2] border border-black/20 px-3 py-2 text-xs outline-none focus:border-black"
                      />
                      <button
                        type="button"
                        onClick={handleAddImageUrl}
                        className="px-3 bg-[#0A0A0A] hover:bg-[#262626] text-white text-xs font-bold uppercase tracking-wider"
                      >
                        Add
                      </button>
                    </div>

                    {/* Live Validation Warning or Live Preview */}
                    {newImageUrl.trim() && (() => {
                      const val = validateImageUrl(newImageUrl);
                      if (val.isWebpage || val.warning) {
                        return (
                          <div className="p-2 bg-amber-50 border border-amber-300 text-amber-900 text-[11px] flex items-start gap-1.5 leading-snug">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                            <span>{val.warning}</span>
                          </div>
                        );
                      }
                      return (
                        <div className="flex items-center gap-2 p-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px]">
                          <div className="w-8 h-8 rounded bg-neutral-200 overflow-hidden shrink-0 border border-black/10">
                            <LuxuryImage
                              src={val.sanitizedUrl}
                              alt="Pending Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="font-medium truncate">Direct image ready &bull; Click "Add" or save directly</span>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Images Preview Strip */}
                {formImages.length > 0 && (
                  <div className="flex items-center gap-3 overflow-x-auto py-2">
                    {formImages.map((img, i) => (
                      <div key={i} className="relative w-16 h-20 bg-neutral-100 border border-black/15 shrink-0 group">
                        <LuxuryImage
                          src={img}
                          alt={`Preview ${i}`}
                          fallbackSrc={FALLBACK_IMAGES[formCategory as keyof typeof FALLBACK_IMAGES] || FALLBACK_IMAGES.default}
                          className="w-full h-full object-cover"
                        />
                        {i === 0 && (
                          <span className="absolute bottom-0 inset-x-0 bg-black/80 text-white text-[8px] font-mono text-center uppercase">
                            Primary
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(i)}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-600 text-white rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold mb-1 uppercase tracking-wider text-[10px] text-neutral-500">
                  Editorial Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Architectural tailoring and fine materials crafted in Paris..."
                  className="w-full bg-[#F8F6F2] border border-black/20 p-2.5 text-xs text-[#0A0A0A] outline-none focus:border-black"
                />
              </div>

              {/* Featured Flags */}
              <div className="flex flex-wrap gap-4 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold uppercase">
                  <input
                    type="checkbox"
                    checked={formIsNewArrival}
                    onChange={(e) => setFormIsNewArrival(e.target.checked)}
                  />
                  <span>New Arrival 2026</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold uppercase">
                  <input
                    type="checkbox"
                    checked={formIsBestseller}
                    onChange={(e) => setFormIsBestseller(e.target.checked)}
                  />
                  <span>Bestseller</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold uppercase">
                  <input
                    type="checkbox"
                    checked={formIsTrending}
                    onChange={(e) => setFormIsTrending(e.target.checked)}
                  />
                  <span>Trending in Store</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-black/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-black/20 text-xs font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0A0A0A] hover:bg-[#262626] text-white text-xs font-bold uppercase tracking-wider border border-[#B99A6B]/30"
                >
                  {editingProduct ? 'Save Revisions' : 'Publish Creation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ORDER INSPECTION & DISPATCH MODAL                        */}
      {/* ======================================================== */}
      {viewingOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-none max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-black/20 max-h-[92vh] overflow-y-auto space-y-6 text-xs">
            <div className="flex items-center justify-between pb-4 border-b border-black/10">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#B99A6B] font-bold">
                  Order Telemetry & Fulfillment Slip
                </span>
                <h3 className="font-sans font-black text-2xl uppercase tracking-tight text-[#0A0A0A] mt-0.5">
                  Order #{viewingOrderModal.orderNumber}
                </h3>
                <p className="text-[11px] text-neutral-400">
                  Placed on {new Date(viewingOrderModal.createdAt).toLocaleString('en-IN')}
                </p>
              </div>
              <button
                onClick={() => setViewingOrderModal(null)}
                className="p-1.5 text-neutral-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Destination Address Card */}
            <div className="p-4 bg-[#F8F6F2] border border-black/10 space-y-2">
              <div className="flex items-center justify-between border-b border-black/10 pb-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#B99A6B] font-bold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Delivery Address</span>
                </span>
                <span className="text-[11px] font-mono font-bold text-[#0A0A0A]">
                  PIN: {viewingOrderModal.shippingAddress?.pincode}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <p className="font-bold text-sm text-[#0A0A0A]">{viewingOrderModal.shippingAddress?.fullName}</p>
                  <p className="text-neutral-700 mt-0.5">{viewingOrderModal.shippingAddress?.addressLine1}</p>
                  {viewingOrderModal.shippingAddress?.addressLine2 && (
                    <p className="text-neutral-500">{viewingOrderModal.shippingAddress?.addressLine2}</p>
                  )}
                  {viewingOrderModal.shippingAddress?.landmark && (
                    <p className="text-neutral-500 italic">Landmark: {viewingOrderModal.shippingAddress?.landmark}</p>
                  )}
                  <p className="font-bold text-[#0A0A0A] mt-1">
                    {viewingOrderModal.shippingAddress?.city}, {viewingOrderModal.shippingAddress?.state} - {viewingOrderModal.shippingAddress?.pincode}
                  </p>
                </div>

                <div className="space-y-1.5 sm:border-l sm:border-black/10 sm:pl-4">
                  <p className="text-neutral-600">
                    Phone:{' '}
                    <a href={`tel:${viewingOrderModal.shippingAddress?.phone}`} className="font-bold text-[#0A0A0A] hover:underline">
                      📞 {viewingOrderModal.shippingAddress?.phone}
                    </a>
                  </p>
                  <p className="text-neutral-600">
                    Email:{' '}
                    <a href={`mailto:${viewingOrderModal.shippingAddress?.email}`} className="font-bold text-[#B99A6B] hover:underline">
                      ✉️ {viewingOrderModal.shippingAddress?.email}
                    </a>
                  </p>
                  <p className="text-neutral-600">
                    Payment Method:{' '}
                    <strong className="text-[#0A0A0A]">{viewingOrderModal.paymentMethod}</strong> (Status: {viewingOrderModal.paymentStatus})
                  </p>
                </div>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold block">
                Acquired Items ({viewingOrderModal.items.length})
              </span>
              <div className="border border-black/10 divide-y divide-black/5">
                {viewingOrderModal.items.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-12 h-16 object-cover border border-black/10" />
                      <div>
                        <p className="font-bold text-xs text-[#0A0A0A]">{item.name}</p>
                        <p className="text-[10px] text-neutral-400">
                          {item.selectedSize ? `Size: ${item.selectedSize}` : ''}
                          {item.selectedColor ? ` • Color: ${item.selectedColor}` : ''}
                          {item.selectedVolume ? ` • Volume: ${item.selectedVolume}` : ''}
                        </p>
                        <p className="text-[11px] font-mono text-neutral-600 mt-1">
                          Qty: {item.quantity} &times; ₹{item.price.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                    <span className="font-black text-sm text-[#0A0A0A]">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="p-4 bg-neutral-50 border border-black/10 space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-neutral-500">Subtotal:</span>
                <span className="font-mono font-bold text-[#0A0A0A]">₹{viewingOrderModal.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {viewingOrderModal.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Privilege Discount ({viewingOrderModal.couponCode || 'PROMO'}):</span>
                  <span className="font-mono font-bold">-₹{viewingOrderModal.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-neutral-500">Shipping (White-Glove Courier):</span>
                <span className="font-mono font-bold text-emerald-700">
                  {viewingOrderModal.shippingFee === 0 ? 'Complimentary' : `₹${viewingOrderModal.shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-black/10 font-black text-sm text-[#0A0A0A]">
                <span>Total Amount Charged:</span>
                <span>₹{viewingOrderModal.total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Courier Tracking & Dispatch Updater */}
            <div className="p-4 bg-white border border-black/20 space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#B99A6B] font-bold block">
                Fulfillment Partner & Telemetry
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">
                    Courier Partner
                  </label>
                  <input
                    type="text"
                    value={courierPartnerInput}
                    onChange={(e) => setCourierPartnerInput(e.target.value)}
                    placeholder="BlueDart Apex Air / Delhivery Express"
                    className="w-full bg-[#F8F6F2] border border-black/20 p-2 text-xs text-[#0A0A0A] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">
                    Tracking Number (AWB)
                  </label>
                  <input
                    type="text"
                    value={trackingNumberInput}
                    onChange={(e) => setTrackingNumberInput(e.target.value)}
                    placeholder="BLUEDART-IND-XXXXXXX"
                    className="w-full bg-[#F8F6F2] border border-black/20 p-2 text-xs font-mono text-[#0A0A0A] outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-neutral-500">Mark Status:</span>
                  <select
                    value={viewingOrderModal.orderStatus}
                    onChange={(e) =>
                      handleUpdateOrderStatus(
                        viewingOrderModal.id,
                        e.target.value as OrderStatus,
                        trackingNumberInput,
                        courierPartnerInput
                      )
                    }
                    className="border border-black/30 px-2 py-1 text-xs font-bold bg-white text-[#0A0A0A] outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Placed">Placed</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Return Requested">Return Requested</option>
                    <option value="Refunded">Refunded</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 border border-black/20 hover:border-black text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Invoice</span>
                  </button>

                  <button
                    onClick={() =>
                      handleUpdateOrderStatus(
                        viewingOrderModal.id,
                        viewingOrderModal.orderStatus,
                        trackingNumberInput,
                        courierPartnerInput
                      )
                    }
                    disabled={isSavingShipment}
                    className="px-4 py-1.5 bg-[#0A0A0A] hover:bg-neutral-800 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B99A6B]" />
                    <span>{isSavingShipment ? 'Saving...' : 'Update Dispatch Info'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
