"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { LogOut } from "lucide-react"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

// Types explicites pour éviter les erreurs TS
interface Mall {
  _id: string;
  name: string;
  location: string;
  description?: string;
  fullDescription?: string;
  image?: string;
  images?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  rating?: number;
  totalReviews?: number;
  tags?: string[];
}
interface Shop { 
  _id: string; 
  name: string; 
  mallId: string;
  description?: string;
  fullDescription?: string;
  image?: string;
  images?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  rating?: number;
  totalReviews?: number;
  tags?: string[];
}
interface Product { 
  _id: string; 
  name: string; 
  price: number; 
  shopId: string;
  description?: string;
  fullDescription?: string;
  images?: string;
  originalPrice?: number;
  discount?: number;
  rating?: number;
  totalReviews?: number;
  tags?: string[];
  category?: string;
  brand?: string;
  material?: string;
  care?: string;
  inStock?: boolean;
  sizes?: string[];
}

export default function AdminPage() {
  const { user, getProfile, getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [malls, setMalls] = useState<Mall[]>([]);
  const [selectedMall, setSelectedMall] = useState<Mall | null>(null);
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [mallForm, setMallForm] = useState<{
    name: string;
    location: string;
    description: string;
    fullDescription: string;
    image: string;
    images: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    rating: string;
    totalReviews: string;
    tags: string;
  }>({
    name: "",
    location: "",
    description: "",
    fullDescription: "",
    image: "",
    images: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    rating: "",
    totalReviews: "",
    tags: "",
  });
  const [shopForm, setShopForm] = useState<{
    name: string;
    description: string;
    fullDescription: string;
    image: string;
    images: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    rating: string;
    totalReviews: string;
    tags: string;
    mallId: string;
  }>({
    name: "",
    description: "",
    fullDescription: "",
    image: "",
    images: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    rating: "",
    totalReviews: "",
    tags: "",
    mallId: "",
  });
  const [productForm, setProductForm] = useState<{
    name: string;
    description: string;
    fullDescription: string;
    images: string;
    price: string;
    originalPrice: string;
    discount: string;
    rating: string;
    totalReviews: string;
    tags: string;
    category: string;
    brand: string;
    material: string;
    care: string;
    shopId: string;
    inStock?: boolean;
    sizes?: string[];
  }>({
    name: "",
    description: "",
    fullDescription: "",
    images: "",
    price: "",
    originalPrice: "",
    discount: "",
    rating: "",
    totalReviews: "",
    tags: "",
    category: "",
    brand: "",
    material: "",
    care: "",
    shopId: "",
    inStock: true,
    sizes: [],
  });
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState<'malls' | 'shops' | 'products'>('malls')
  const [searchMall, setSearchMall] = useState('')
  const [searchShop, setSearchShop] = useState('')
  const [searchProduct, setSearchProduct] = useState('')
  const [editMall, setEditMall] = useState<any | null>(null)
  const [editShop, setEditShop] = useState<any | null>(null)
  const [editProduct, setEditProduct] = useState<any | null>(null)
  const [deleteMall, setDeleteMall] = useState<any | null>(null)
  const [deleteShop, setDeleteShop] = useState<any | null>(null)
  const [deleteProduct, setDeleteProduct] = useState<any | null>(null)
  const { toast } = useToast()
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  useEffect(() => {
    getProfile().finally(() => setLoading(false));
    // eslint-disable-next-line
  }, []);

  // Ajoute ces hooks pour charger tous les shops et produits au chargement
  useEffect(() => {
    if (user && user.role === "admin") {
      fetchMalls();
      fetchAllShops();
      fetchAllProducts();
    }
    // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    if (selectedMall) {
      fetchShops(selectedMall._id);
      setSelectedShop(null);
      setProducts([]);
    }
  }, [selectedMall]);

  useEffect(() => {
    if (selectedShop) {
      fetchProducts(selectedShop._id);
    }
  }, [selectedShop]);

  const fetchMalls = async () => {
    const res = await fetch("http://localhost:5000/api/malls");
    const data = await res.json();
    setMalls(data);
  };

  const fetchShops = async (mallId: string) => {
    const res = await fetch(`http://localhost:5000/api/shops/mall/${mallId}`);
    const data = await res.json();
    setShops(data);
  };

  const fetchProducts = async (shopId: string) => {
    const res = await fetch(`http://localhost:5000/api/products/shop/${shopId}`);
    const data = await res.json();
    setProducts(data);
  };

  const fetchAllShops = async () => {
    const res = await fetch("http://localhost:5000/api/shops");
    const data = await res.json();
    setShops(data);
  };
  const fetchAllProducts = async () => {
    const res = await fetch("http://localhost:5000/api/products");
    const data = await res.json();
    setProducts(data);
  };

  // Ajout Mall
  const handleAddMall = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    // Préparer les tags en tableau, rating et totalReviews en nombre
    const mallToSend = {
      ...mallForm,
      rating: mallForm.rating ? Number(mallForm.rating) : undefined,
      totalReviews: mallForm.totalReviews ? Number(mallForm.totalReviews) : undefined,
      tags: mallForm.tags ? mallForm.tags.split(",").map(t => t.trim()) : [],
    };
    const res = await fetch("http://localhost:5000/api/malls", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(mallToSend),
    });
    if (res.ok) {
      setMallForm({
        name: "",
        location: "",
        description: "",
        fullDescription: "",
        image: "",
        images: "",
        address: "",
        phone: "",
        email: "",
        website: "",
        rating: "",
        totalReviews: "",
        tags: "",
      });
      fetchMalls();
      setMessage("Mall ajouté avec succès !");
      setTimeout(() => setMessage(""), 2000);
    } else {
      const data = await res.json();
      setMessage(data.error || "Erreur lors de l'ajout du mall");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // Ajout Shop
  const handleAddShop = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    if (!selectedMall) return;
    // Préparer les tags en tableau, rating et totalReviews en nombre
    const shopToSend = {
      ...shopForm,
      mallId: shopForm.mallId,
      rating: shopForm.rating ? Number(shopForm.rating) : undefined,
      totalReviews: shopForm.totalReviews ? Number(shopForm.totalReviews) : undefined,
      images: Array.isArray(shopForm.images)
        ? shopForm.images
        : (shopForm.images ? shopForm.images.split(",").map(img => img.trim()).filter(Boolean) : []),
      tags: shopForm.tags ? shopForm.tags.split(",").map(t => t.trim()) : [],
    };
    if (!shopToSend.mallId || shopToSend.mallId.length !== 24) {
      toast({ title: "Erreur", description: "Veuillez sélectionner un mall valide.", variant: "destructive" });
      return;
    }
    const res = await fetch("http://localhost:5000/api/shops", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(shopToSend),
    });
    if (res.ok) {
      setShopForm({
        name: "",
        description: "",
        fullDescription: "",
        image: "",
        images: "",
        address: "",
        phone: "",
        email: "",
        website: "",
        rating: "",
        totalReviews: "",
        tags: "",
        mallId: "",
      });
      fetchShops(selectedMall._id);
      setMessage("Shop ajouté avec succès !");
      setTimeout(() => setMessage(""), 2000);
    } else {
      const data = await res.json();
      setMessage(data.error || "Erreur lors de l'ajout du shop");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // Ajout Product


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="mb-4 text-lg">Chargement...</p>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="mb-4 text-lg text-red-500">Accès réservé aux administrateurs.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-row bg-gradient-to-br from-blue-50/80 via-white/80 to-blue-100/80 dark:from-gray-900/80 dark:via-gray-950/80 dark:to-gray-900/80">
      {/* Sidebar glassmorphism */}
      <aside className="w-64 min-h-screen bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl shadow-2xl flex flex-col justify-between p-6 sticky top-0 z-30 border-r border-blue-100 dark:border-gray-800 transition-all duration-300">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <img src="/placeholder-logo.svg" alt="Logo" className="w-10 h-10 rounded-full shadow-lg" />
            <span className="text-2xl font-extrabold text-blue-700 dark:text-blue-400 tracking-tight">EMALL Admin</span>
          </div>
          <nav className="flex flex-col gap-3 mt-8">
            <Button variant={activeTab === 'malls' ? 'secondary' : 'ghost'} className="justify-start text-lg rounded-xl" onClick={() => setActiveTab('malls')}>🏢 Malls</Button>
            <Button variant={activeTab === 'shops' ? 'secondary' : 'ghost'} className="justify-start text-lg rounded-xl" onClick={() => setActiveTab('shops')}>🛍️ Shops</Button>
            <Button variant={activeTab === 'products' ? 'secondary' : 'ghost'} className="justify-start text-lg rounded-xl" onClick={() => setActiveTab('products')}>🛒 Produits</Button>
          </nav>
        </div>
        <Button variant="outline" className="w-full flex items-center gap-2 mt-8 rounded-xl bg-gradient-to-r from-blue-100/60 to-blue-200/60 dark:from-gray-800/60 dark:to-gray-900/60 hover:scale-105 transition-all" onClick={() => { /* Ajoute ici la logique de logout si besoin */ }}>
          <LogOut className="w-5 h-5" /> Déconnexion
        </Button>
      </aside>
      {/* Main content */}
      <main className="flex-1 p-8 flex flex-col gap-8">
        {/* Header sticky */}
        <header className="flex items-center justify-between mb-8 sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-xl shadow-md px-6 py-4 border border-blue-100 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <img src="/placeholder-user.jpg" alt="Admin avatar" className="w-12 h-12 rounded-full border-4 border-blue-200 dark:border-blue-900 shadow-md" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bienvenue, {user && 'name' in user ? (user as any).name : "Admin"}</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Gérez vos malls, shops et produits facilement</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-base px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow">{user?.role?.toUpperCase() || "ADMIN"}</Badge>
        </header>
        {/* Dashboard stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-lg p-6 flex flex-col items-center gap-2 border border-blue-100 dark:border-gray-800">
            <span className="text-4xl">🏢</span>
            <span className="text-2xl font-bold text-blue-700 dark:text-blue-400">{malls.length}</span>
            <span className="text-gray-500 dark:text-gray-400">Malls</span>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-lg p-6 flex flex-col items-center gap-2 border border-blue-100 dark:border-gray-800">
            <span className="text-4xl">🛍️</span>
            <span className="text-2xl font-bold text-blue-700 dark:text-blue-400">{shops.length}</span>
            <span className="text-gray-500 dark:text-gray-400">Shops</span>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-lg p-6 flex flex-col items-center gap-2 border border-blue-100 dark:border-gray-800">
            <span className="text-4xl">🛒</span>
            <span className="text-2xl font-bold text-blue-700 dark:text-blue-400">{products.length}</span>
            <span className="text-gray-500 dark:text-gray-400">Produits</span>
          </div>
        </div>
        {/* Onglet dynamique */}
        {activeTab === 'malls' && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <Input
                placeholder="Rechercher un mall..."
                value={searchMall}
                onChange={e => setSearchMall(e.target.value)}
                className="w-1/2"
              />
              <Button onClick={() => {
                setEditMall({});
                setMallForm({
                  name: "",
                  location: "",
                  description: "",
                  fullDescription: "",
                  image: "",
                  images: "",
                  address: "",
                  phone: "",
                  email: "",
                  website: "",
                  rating: "",
                  totalReviews: "",
                  tags: "",
                });
              }} className="bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold shadow-lg">+ Ajouter un Mall</Button>
            </div>
            <div className="overflow-x-auto rounded-xl shadow">
              <table className="min-w-full bg-white dark:bg-gray-900">
                <thead>
                  <tr className="border-b border-blue-100 dark:border-gray-800">
                    <th className="py-3 px-4 text-left">Nom</th>
                    <th className="py-3 px-4 text-left">Localisation</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {malls.filter(mall => mall.name.toLowerCase().includes(searchMall.toLowerCase())).map(mall => (
                    <tr key={mall._id} className="border-b border-blue-50 dark:border-gray-800 hover:bg-blue-50/40 dark:hover:bg-blue-900/20 transition-all">
                      <td className="py-3 px-4 font-semibold">{mall.name}</td>
                      <td className="py-3 px-4">{mall.location}</td>
                      <td className="py-3 px-4 flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => {
                          setEditMall(mall);
                          setMallForm({
                            name: mall.name || "",
                            location: mall.location || "",
                            description: mall.description || "",
                            fullDescription: mall.fullDescription || "",
                            image: mall.image || "",
                            images: mall.images || "",
                            address: mall.address || "",
                            phone: mall.phone || "",
                            email: mall.email || "",
                            website: mall.website || "",
                            rating: mall.rating ? mall.rating.toString() : "",
                            totalReviews: mall.totalReviews ? mall.totalReviews.toString() : "",
                            tags: mall.tags ? mall.tags.join(", ") : "",
                          });
                        }}>Éditer</Button>
                        <Button size="sm" variant="destructive" onClick={() => setDeleteMall(mall)}>Supprimer</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Modal Ajout/Édition Mall */}
            <Dialog open={!!editMall} onOpenChange={v => {
              if (!v) setEditMall(null);
            }}>
              <DialogContent className="max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editMall && editMall._id ? "Éditer le Mall" : "Ajouter un Mall"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={async e => {
                  e.preventDefault();
                  const mallToSend = {
                    ...mallForm,
                    _id: editMall?._id, // Garder seulement l'ID pour l'édition
                    rating: mallForm.rating ? Number(mallForm.rating) : undefined,
                    totalReviews: mallForm.totalReviews ? Number(mallForm.totalReviews) : undefined,
                    tags: mallForm.tags ? mallForm.tags.split(",").map(t => t.trim()) : [],
                  };
                  const method = editMall && editMall._id ? "PUT" : "POST";
                  const url = editMall && editMall._id ? `http://localhost:5000/api/malls/${editMall._id}` : "http://localhost:5000/api/malls";
                  const res = await fetch(url, {
                    method,
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${getToken()}`,
                    },
                    body: JSON.stringify(mallToSend),
                  });
                  if (res.ok) {
                    toast({ title: editMall && editMall._id ? "Mall modifié !" : "Mall ajouté !", variant: "default" });
                    setEditMall(null);
                    fetchMalls();
                  } else {
                    const data = await res.json();
                    toast({ title: "Erreur", description: data.error || "Erreur lors de l'enregistrement du mall", variant: "destructive" });
                  }
                }} className="flex flex-col gap-4 mt-4">
                  <Input placeholder="Nom du mall" value={mallForm.name} onChange={e => setMallForm({ ...mallForm, name: e.target.value })} required />
                  <Input placeholder="Localisation" value={mallForm.location} onChange={e => setMallForm({ ...mallForm, location: e.target.value })} required />
                  <Input placeholder="Description" value={mallForm.description} onChange={e => setMallForm({ ...mallForm, description: e.target.value })} />
                  <Input placeholder="Description complète" value={mallForm.fullDescription} onChange={e => setMallForm({ ...mallForm, fullDescription: e.target.value })} />
                  {/* Champ Image principale + aperçu pour Mall */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Image principale (URL)</label>
                    <Input placeholder="Image principale (URL)" value={mallForm.image} onChange={e => setMallForm({ ...mallForm, image: e.target.value })} />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Collez l’URL d’une image principale</span>
                    <div className="mt-2 flex items-center justify-center">
                      <img
                        src={mallForm.image || '/placeholder.svg'}
                        alt="Aperçu image principale mall"
                        className="w-40 h-28 object-cover rounded shadow border"
                        onError={e => (e.currentTarget.src = '/placeholder.svg')}
                      />
                    </div>
                  </div>
                  {/* Champ Images secondaires + aperçu pour Mall */}
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Images secondaires (URLs séparées par des virgules)</label>
                    <Input placeholder="Images secondaires (URLs séparées par des virgules)" value={mallForm.images || ''} onChange={e => setMallForm({ ...mallForm, images: e.target.value })} />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Collez une ou plusieurs URLs d’images secondaires</span>
                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                      {(
                        mallForm.images
                          ? (Array.isArray(mallForm.images) ? mallForm.images.join(',') : mallForm.images)
                          : ''
                      ).split(',').map(url => url.trim()).filter(Boolean).slice(0,4).map((url, i, arr) => (
                        <div key={i} className="relative group">
                          <img
                            src={url || '/placeholder.svg'}
                            alt={`Aperçu image secondaire mall ${i+1}`}
                            className="w-20 h-16 object-cover rounded shadow border"
                            onError={e => (e.currentTarget.src = '/placeholder.svg')}
                          />
                          <button
                            type="button"
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-80 group-hover:opacity-100 transition"
                            onClick={() => {
                              const newArr = arr.filter((_, idx) => idx !== i)
                              setMallForm({ ...mallForm, images: newArr.join(', ') })
                            }}
                          >×</button>
                        </div>
                      ))}
                      {(!mallForm.images || (Array.isArray(mallForm.images) ? mallForm.images.length === 0 : mallForm.images.split(',').filter(Boolean).length === 0)) && (
                        <img src="/placeholder.svg" alt="Aperçu image secondaire mall" className="w-20 h-16 object-cover rounded shadow border" />
                      )}
                    </div>
                  </div>
                  <Input placeholder="Adresse" value={mallForm.address} onChange={e => setMallForm({ ...mallForm, address: e.target.value })} />
                  <Input placeholder="Téléphone" value={mallForm.phone} onChange={e => setMallForm({ ...mallForm, phone: e.target.value })} />
                  <Input placeholder="Email" value={mallForm.email} onChange={e => setMallForm({ ...mallForm, email: e.target.value })} />
                  <Input placeholder="Site web" value={mallForm.website} onChange={e => setMallForm({ ...mallForm, website: e.target.value })} />
                  <Input placeholder="Note (ex: 4.5)" value={mallForm.rating} onChange={e => setMallForm({ ...mallForm, rating: e.target.value })} />
                  <Input placeholder="Nombre d'avis" value={mallForm.totalReviews} onChange={e => setMallForm({ ...mallForm, totalReviews: e.target.value })} />
                  <Input placeholder="Tags (séparés par des virgules)" value={mallForm.tags} onChange={e => setMallForm({ ...mallForm, tags: e.target.value })} />
                  <DialogFooter>
                    <Button type="submit" className="w-full mt-2">{editMall && editMall._id ? "Enregistrer" : "Ajouter"}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            {/* Modal Confirmation Suppression Mall */}
            <Dialog open={!!deleteMall} onOpenChange={v => !v && setDeleteMall(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Supprimer ce mall ?</DialogTitle>
                </DialogHeader>
                <p>Cette action est irréversible.</p>
                <DialogFooter>
                  <Button variant="destructive" onClick={async () => {
                    const res = await fetch(`http://localhost:5000/api/malls/${deleteMall._id}`, {
                      method: "DELETE",
                      headers: { Authorization: `Bearer ${getToken()}` },
                    });
                    if (res.ok) {
                      toast({ title: "Mall supprimé !", variant: "default" });
                      setDeleteMall(null);
                      fetchMalls();
                    } else {
                      toast({ title: "Erreur", description: "Erreur lors de la suppression", variant: "destructive" });
                    }
                  }}>Supprimer</Button>
                  <Button variant="outline" onClick={() => setDeleteMall(null)}>Annuler</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </section>
        )}
        {activeTab === 'shops' && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <Input
                placeholder="Rechercher un shop..."
                value={searchShop}
                onChange={e => setSearchShop(e.target.value)}
                className="w-1/2"
              />
              <Button onClick={() => {
                setEditShop({});
                setShopForm({
                  name: "",
                  description: "",
                  fullDescription: "",
                  image: "",
                  images: "",
                  address: "",
                  phone: "",
                  email: "",
                  website: "",
                  rating: "",
                  totalReviews: "",
                  tags: "",
                  mallId: "",
                });
              }} className="bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold shadow-lg">+ Ajouter un Shop</Button>
            </div>
            <div className="overflow-x-auto rounded-xl shadow">
              <table className="min-w-full bg-white dark:bg-gray-900">
                <thead>
                  <tr className="border-b border-blue-100 dark:border-gray-800">
                    <th className="py-3 px-4 text-left">Nom</th>
                    <th className="py-3 px-4 text-left">Mall</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {shops.filter(shop => shop.name.toLowerCase().includes(searchShop.toLowerCase())).map(shop => (
                    <tr key={shop._id} className="border-b border-blue-50 dark:border-gray-800 hover:bg-blue-50/40 dark:hover:bg-blue-900/20 transition-all">
                      <td className="py-3 px-4 font-semibold">{shop.name}</td>
                      <td className="py-3 px-4">{shop.mallId}</td>
                      <td className="py-3 px-4 flex gap-2">
                        {shop._id && (
                          <Button size="sm" variant="outline" onClick={() => {
                            setEditShop(shop);
                            setShopForm({
                              name: shop.name || "",
                              description: shop.description || "",
                              fullDescription: shop.fullDescription || "",
                              image: shop.image || "",
                              images: shop.images || "",
                              address: shop.address || "",
                              phone: shop.phone || "",
                              email: shop.email || "",
                              website: shop.website || "",
                              rating: shop.rating ? shop.rating.toString() : "",
                              totalReviews: shop.totalReviews ? shop.totalReviews.toString() : "",
                              tags: shop.tags ? shop.tags.join(", ") : "",
                              mallId: shop.mallId || "",
                            });
                          }}>Éditer</Button>
                        )}
                        {shop._id && (
                          <Button size="sm" variant="destructive" onClick={() => setDeleteShop(shop)}>Supprimer</Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Modals d'ajout/édition/suppression Shop à compléter ici */}
            {/* Modal Ajout/Édition Shop */}
            <Dialog open={!!editShop} onOpenChange={v => {
              if (!v) setEditShop(null);
            }}>
              <DialogContent className="max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editShop && editShop._id ? "Éditer le Shop" : "Ajouter un Shop"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={async e => {
                  e.preventDefault();
                  const shopToSend = {
                    ...shopForm,
                    _id: editShop?._id, // Garder seulement l'ID pour l'édition
                    rating: shopForm.rating ? Number(shopForm.rating) : undefined,
                    totalReviews: shopForm.totalReviews ? Number(shopForm.totalReviews) : undefined,
                    images: Array.isArray(shopForm.images)
                      ? shopForm.images
                      : (shopForm.images ? shopForm.images.split(",").map(img => img.trim()).filter(Boolean) : []),
                    tags: shopForm.tags ? shopForm.tags.split(",").map(t => t.trim()) : [],
                  };
                  const method = editShop && editShop._id ? "PUT" : "POST";
                  const url = editShop && editShop._id ? `http://localhost:5000/api/shops/${editShop._id}` : "http://localhost:5000/api/shops";
                  const res = await fetch(url, {
                    method,
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${getToken()}`,
                    },
                    body: JSON.stringify(shopToSend),
                  });
                  if (res.ok) {
                    toast({ title: editShop && editShop._id ? "Shop modifié !" : "Shop ajouté !", variant: "default" });
                    setEditShop(null);
                    if (selectedMall && selectedMall._id) {
                      fetchShops(selectedMall._id);
                    } else {
                      fetchAllShops();
                    }
                  } else {
                    const data = await res.json();
                    toast({ title: "Erreur", description: data.error || "Erreur lors de l'enregistrement du shop", variant: "destructive" });
                  }
                }} className="flex flex-col gap-4 mt-4">
                  <Input placeholder="Nom du shop" value={shopForm.name} onChange={e => setShopForm({ ...shopForm, name: e.target.value })} required />
                  <Input placeholder="Description" value={shopForm.description} onChange={e => setShopForm({ ...shopForm, description: e.target.value })} />
                  <Input placeholder="Description complète" value={shopForm.fullDescription} onChange={e => setShopForm({ ...shopForm, fullDescription: e.target.value })} />
                  {/* Champ Image principale + aperçu pour Shop */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Image principale (URL)</label>
                    <Input placeholder="Image principale (URL)" value={shopForm.image} onChange={e => setShopForm({ ...shopForm, image: e.target.value })} />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Collez l'URL d'une image principale</span>
                    <div className="mt-2 flex items-center justify-center">
                      <img
                        src={shopForm.image || '/placeholder.svg'}
                        alt="Aperçu image principale shop"
                        className="w-40 h-28 object-cover rounded shadow border"
                        onError={e => (e.currentTarget.src = '/placeholder.svg')}
                      />
                    </div>
                  </div>
                  {/* Champ Images secondaires + aperçu pour Shop */}
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Images secondaires (URLs séparées par des virgules)</label>
                    <Input placeholder="Images secondaires (URLs séparées par des virgules)" value={shopForm.images || ''} onChange={e => setShopForm({ ...shopForm, images: e.target.value })} />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Collez une ou plusieurs URLs d’images secondaires</span>
                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                      {(
                        shopForm.images
                          ? (Array.isArray(shopForm.images) ? shopForm.images.join(',') : shopForm.images)
                          : ''
                      ).split(',').map(url => url.trim()).filter(Boolean).slice(0,4).map((url, i, arr) => (
                        <div key={i} className="relative group">
                          <img
                            src={url || '/placeholder.svg'}
                            alt={`Aperçu image secondaire shop ${i+1}`}
                            className="w-20 h-16 object-cover rounded shadow border"
                            onError={e => (e.currentTarget.src = '/placeholder.svg')}
                          />
                          <button
                            type="button"
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-80 group-hover:opacity-100 transition"
                            onClick={() => {
                              const newArr = arr.filter((_, idx) => idx !== i)
                              setShopForm({ ...shopForm, images: newArr.join(', ') })
                            }}
                          >×</button>
                        </div>
                      ))}
                      {(!shopForm.images || (Array.isArray(shopForm.images) ? shopForm.images.length === 0 : shopForm.images.split(',').filter(Boolean).length === 0)) && (
                        <img src="/placeholder.svg" alt="Aperçu image secondaire shop" className="w-20 h-16 object-cover rounded shadow border" />
                      )}
                    </div>
                  </div>
                  {/* Champ sélection du mall pour Shop */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Mall parent</label>
                    <select
                      value={shopForm.mallId || ""}
                      onChange={e => setShopForm({ ...shopForm, mallId: e.target.value })}
                      required
                      className="input border rounded px-3 py-2"
                    >
                      <option value="">Sélectionner un mall</option>
                      {malls.map(mall => (
                        <option key={mall._id} value={mall._id}>{mall.name}</option>
                      ))}
                    </select>
                  </div>
                  <Input placeholder="Adresse" value={shopForm.address} onChange={e => setShopForm({ ...shopForm, address: e.target.value })} />
                  <Input placeholder="Téléphone" value={shopForm.phone} onChange={e => setShopForm({ ...shopForm, phone: e.target.value })} />
                  <Input placeholder="Email" value={shopForm.email} onChange={e => setShopForm({ ...shopForm, email: e.target.value })} />
                  <Input placeholder="Site web" value={shopForm.website} onChange={e => setShopForm({ ...shopForm, website: e.target.value })} />
                  <Input placeholder="Note (ex: 4.5)" value={shopForm.rating} onChange={e => setShopForm({ ...shopForm, rating: e.target.value })} />
                  <Input placeholder="Nombre d'avis" value={shopForm.totalReviews} onChange={e => setShopForm({ ...shopForm, totalReviews: e.target.value })} />
                  <Input placeholder="Tags (séparés par des virgules)" value={shopForm.tags} onChange={e => setShopForm({ ...shopForm, tags: e.target.value })} />
                  <DialogFooter>
                    <Button type="submit" className="w-full mt-2">{editShop && editShop._id ? "Enregistrer" : "Ajouter"}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            {/* Modal Confirmation Suppression Shop */}
            <Dialog open={!!deleteShop} onOpenChange={v => !v && setDeleteShop(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Supprimer ce shop ?</DialogTitle>
                </DialogHeader>
                <p>Cette action est irréversible.</p>
                <DialogFooter>
                  <Button variant="destructive" onClick={async () => {
                    if (!deleteShop || !deleteShop._id) {
                      toast({ title: "Erreur", description: "Shop introuvable", variant: "destructive" });
                      return;
                    }
                    const res = await fetch(`http://localhost:5000/api/shops/${deleteShop._id}`, {
                      method: "DELETE",
                      headers: { Authorization: `Bearer ${getToken()}` },
                    });
                    if (res.ok) {
                      toast({ title: "Shop supprimé !", variant: "default" });
                      setDeleteShop(null);
                      if (selectedMall && selectedMall._id) {
                        fetchShops(selectedMall._id);
                      } else {
                        fetchAllShops();
                      }
                    } else {
                      const data = await res.json().catch(() => ({}));
                      toast({ title: "Erreur", description: data.error || "Erreur lors de la suppression du shop", variant: "destructive" });
                    }
                  }}>Supprimer</Button>
                  <Button variant="outline" onClick={() => setDeleteShop(null)}>Annuler</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </section>
        )}
        {activeTab === 'products' && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <Input
                placeholder="Rechercher un produit..."
                value={searchProduct}
                onChange={e => setSearchProduct(e.target.value)}
                className="w-1/2"
              />
              <Button onClick={() => {
                setEditProduct({});
                setProductForm({
                  name: "",
                  description: "",
                  fullDescription: "",
                  images: "",
                  price: "",
                  originalPrice: "",
                  discount: "",
                  rating: "",
                  totalReviews: "",
                  tags: "",
                  category: "",
                  brand: "",
                  material: "",
                  care: "",
                  shopId: "",
                  inStock: true,
                  sizes: [],
                });
              }} className="bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold shadow-lg">+ Ajouter un Produit</Button>
            </div>
            <div className="overflow-x-auto rounded-xl shadow">
              <table className="min-w-full bg-white dark:bg-gray-900">
                <thead>
                  <tr className="border-b border-blue-100 dark:border-gray-800">
                    <th className="py-3 px-4 text-left">Nom</th>
                    <th className="py-3 px-4 text-left">Shop</th>
                    <th className="py-3 px-4 text-left">Prix</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.filter(product => product.name.toLowerCase().includes(searchProduct.toLowerCase())).map(product => (
                    <tr key={product._id} className="border-b border-blue-50 dark:border-gray-800 hover:bg-blue-50/40 dark:hover:bg-blue-900/20 transition-all">
                      <td className="py-3 px-4 font-semibold">{product.name}</td>
                      <td className="py-3 px-4">{product.shopId}</td>
                      <td className="py-3 px-4">{product.price}</td>
                      <td className="py-3 px-4 flex gap-2">
                        {product._id && (
                          <Button size="sm" variant="outline" onClick={() => {
                            setEditProduct(product);
                            setProductForm({
                              name: product.name || "",
                              description: product.description || "",
                              fullDescription: product.fullDescription || "",
                              images: product.images || "",
                              price: product.price ? product.price.toString() : "",
                              originalPrice: product.originalPrice ? product.originalPrice.toString() : "",
                              discount: product.discount ? product.discount.toString() : "",
                              rating: product.rating ? product.rating.toString() : "",
                              totalReviews: product.totalReviews ? product.totalReviews.toString() : "",
                              tags: product.tags ? product.tags.join(", ") : "",
                              category: product.category || "",
                              brand: product.brand || "",
                              material: product.material || "",
                              care: product.care || "",
                              shopId: product.shopId || "",
                              inStock: product.inStock ?? true,
                              sizes: product.sizes || [],
                            });
                          }}>Éditer</Button>
                        )}
                        {product._id && (
                          <Button size="sm" variant="destructive" onClick={() => setDeleteProduct(product)}>Supprimer</Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Modals d'ajout/édition/suppression Produit à compléter ici */}
            {/* Modal Ajout/Édition Produit */}
            <Dialog open={!!editProduct} onOpenChange={v => {
              if (!v) setEditProduct(null);
            }}>
              <DialogContent className="max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editProduct && editProduct._id ? "Éditer le Produit" : "Ajouter un Produit"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={async e => {
                  e.preventDefault();
                  
                  // Validation des champs obligatoires
                  if (!productForm.name || !productForm.price || !productForm.shopId) {
                    toast({ 
                      title: "Erreur", 
                      description: "Veuillez remplir le nom, le prix et sélectionner un shop.", 
                      variant: "destructive" 
                    });
                    return;
                  }
                  
                  let productToSend;
                  if (editProduct && editProduct._id) {
                    // Édition : on garde seulement _id
                    productToSend = {
                      ...productForm,
                      _id: editProduct._id,
                      price: productForm.price ? Number(productForm.price) : undefined,
                      originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : undefined,
                      discount: productForm.discount ? Number(productForm.discount) : undefined,
                      rating: productForm.rating ? Number(productForm.rating) : undefined,
                      totalReviews: productForm.totalReviews ? Number(productForm.totalReviews) : undefined,
                      images: Array.isArray(productForm.images)
                        ? productForm.images
                        : (productForm.images ? productForm.images.split(",").map(img => img.trim()).filter(Boolean) : []),
                      tags: productForm.tags ? productForm.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
                      inStock: productForm.inStock ?? true,
                      sizes: Array.isArray(productForm.sizes)
                        ? productForm.sizes
                        : (productForm.sizes ? productForm.sizes.split(",").map(s => s.trim()).filter(Boolean) : []),
                    };
                  } else {
                    // Création : on retire explicitement id et _id
                    const { id, _id, ...productData } = productForm;
                    productToSend = {
                      ...productData,
                      price: productForm.price ? Number(productForm.price) : undefined,
                      originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : undefined,
                      discount: productForm.discount ? Number(productForm.discount) : undefined,
                      rating: productForm.rating ? Number(productForm.rating) : undefined,
                      totalReviews: productForm.totalReviews ? Number(productForm.totalReviews) : undefined,
                      images: Array.isArray(productForm.images)
                        ? productForm.images
                        : (productForm.images ? productForm.images.split(",").map(img => img.trim()).filter(Boolean) : []),
                      tags: productForm.tags ? productForm.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
                      inStock: productForm.inStock ?? true,
                      sizes: Array.isArray(productForm.sizes)
                        ? productForm.sizes
                        : (productForm.sizes ? productForm.sizes.split(",").map(s => s.trim()).filter(Boolean) : []),
                    };
                  }
                  const method = editProduct && editProduct._id ? "PUT" : "POST";
                  const url = editProduct && editProduct._id ? `http://localhost:5000/api/products/${editProduct._id}` : "http://localhost:5000/api/products";
                  const res = await fetch(url, {
                    method,
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${getToken()}`,
                    },
                    body: JSON.stringify(productToSend),
                  });
                  if (res.ok) {
                    toast({ title: editProduct && editProduct._id ? "Produit modifié !" : "Produit ajouté !", variant: "default" });
                    setEditProduct(null);
                    if (selectedShop && selectedShop._id) {
                      fetchProducts(selectedShop._id);
                    } else {
                      fetchAllProducts();
                    }
                  } else {
                    const data = await res.json();
                    toast({ title: "Erreur", description: data.error || "Erreur lors de l'enregistrement du produit", variant: "destructive" });
                  }
                }} className="flex flex-col gap-4 mt-4">
                  <Input placeholder="Nom du produit" value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} required />
                  <Input placeholder="Description" value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} />
                  <Input placeholder="Description complète" value={productForm.fullDescription} onChange={e => setProductForm({ ...productForm, fullDescription: e.target.value })} />
                  {/* Champ Images + aperçu pour Produit */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Images (URLs séparées par des virgules)</label>
                    <Input placeholder="Images (URLs séparées par des virgules)" value={productForm.images} onChange={e => setProductForm({ ...productForm, images: e.target.value })} />
                    <span className="text-xs text-gray-500 dark:text-gray-400">Collez une ou plusieurs URLs d'images</span>
                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                      {(
                        productForm.images
                          ? (Array.isArray(productForm.images) ? productForm.images.join(',') : productForm.images)
                          : ''
                      ).split(',').map((url: string) => url.trim()).filter(Boolean).slice(0,4).map((url: string, i: number, arr: string[]) => (
                        <div key={i} className="relative group">
                          <img
                            src={url || '/placeholder.svg'}
                            alt={`Aperçu image produit ${i+1}`}
                            className="w-20 h-16 object-cover rounded shadow border"
                            onError={e => (e.currentTarget.src = '/placeholder.svg')}
                          />
                          <button
                            type="button"
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-80 group-hover:opacity-100 transition"
                            onClick={() => {
                              const newArr = arr.filter((_, idx) => idx !== i)
                              setProductForm({ ...productForm, images: newArr.join(', ') })
                            }}
                          >×</button>
                        </div>
                      ))}
                      {(!productForm.images || (Array.isArray(productForm.images) ? productForm.images.length === 0 : productForm.images.split(',').filter(Boolean).length === 0)) && (
                        <img src="/placeholder.svg" alt="Aperçu image produit" className="w-20 h-16 object-cover rounded shadow border" />
                      )}
                    </div>
                  </div>
                  <Input placeholder="Prix" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} required />
                  <Input placeholder="Prix original" value={productForm.originalPrice} onChange={e => setProductForm({ ...productForm, originalPrice: e.target.value })} />
                  <Input placeholder="Remise (%)" value={productForm.discount} onChange={e => setProductForm({ ...productForm, discount: e.target.value })} />
                  <Input placeholder="Note (ex: 4.5)" value={productForm.rating} onChange={e => setProductForm({ ...productForm, rating: e.target.value })} />
                  <Input placeholder="Nombre d'avis" value={productForm.totalReviews} onChange={e => setProductForm({ ...productForm, totalReviews: e.target.value })} />
                  <Input placeholder="Tags (séparés par des virgules)" value={productForm.tags} onChange={e => setProductForm({ ...productForm, tags: e.target.value })} />
                  <Input placeholder="Catégorie" value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })} />
                  <Input placeholder="Marque" value={productForm.brand} onChange={e => setProductForm({ ...productForm, brand: e.target.value })} />
                  <Input placeholder="Matériau" value={productForm.material} onChange={e => setProductForm({ ...productForm, material: e.target.value })} />
                  <Input placeholder="Entretien" value={productForm.care} onChange={e => setProductForm({ ...productForm, care: e.target.value })} />
                  {/* Champ In Stock */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="inStock"
                      checked={productForm.inStock ?? true}
                      onChange={e => setProductForm({ ...productForm, inStock: e.target.checked })}
                    />
                    <label htmlFor="inStock" className="text-sm">Produit en stock</label>
                  </div>
                  {/* Champ tailles disponibles (cases à cocher) */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tailles disponibles</label>
                    <div className="flex flex-wrap gap-3">
                      {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Autre'].map(size => (
                        <label key={size} className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            checked={Array.isArray(productForm.sizes) && productForm.sizes.includes(size)}
                            onChange={e => {
                              if (e.target.checked) {
                                setProductForm({
                                  ...productForm,
                                  sizes: Array.isArray(productForm.sizes)
                                    ? [...productForm.sizes, size]
                                    : [size],
                                });
                              } else {
                                setProductForm({
                                  ...productForm,
                                  sizes: Array.isArray(productForm.sizes)
                                    ? productForm.sizes.filter(s => s !== size)
                                    : [],
                                });
                              }
                            }}
                          />
                          <span>{size}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {/* Champ sélection du shop pour Produit */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Shop parent</label>
                    <Select
                      value={productForm.shopId}
                      onValueChange={v => setProductForm({ ...productForm, shopId: v })}
                      required
                    >
                      <SelectTrigger className="input border rounded px-3 py-2">
                        <SelectValue placeholder="Sélectionner un shop" />
                      </SelectTrigger>
                      <SelectContent>
                        {shops.map(shop => (
                          <SelectItem key={shop._id} value={shop._id}>{shop.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="w-full mt-2">{editProduct && editProduct._id ? "Enregistrer" : "Ajouter"}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            {/* Modal Confirmation Suppression Produit */}
            <Dialog open={!!deleteProduct} onOpenChange={v => !v && setDeleteProduct(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Supprimer ce produit ?</DialogTitle>
                </DialogHeader>
                <p>Cette action est irréversible.</p>
                <DialogFooter>
                  <Button variant="destructive" onClick={async () => {
                    if (!deleteProduct || !deleteProduct._id) {
                      toast({ title: "Erreur", description: "Produit introuvable", variant: "destructive" });
                      return;
                    }
                    const res = await fetch(`http://localhost:5000/api/products/${deleteProduct._id}`, {
                      method: "DELETE",
                      headers: { Authorization: `Bearer ${getToken()}` },
                    });
                    if (res.ok) {
                      toast({ title: "Produit supprimé !", variant: "default" });
                      setDeleteProduct(null);
                      if (selectedShop && selectedShop._id) {
                        fetchProducts(selectedShop._id);
                      } else {
                        fetchAllProducts();
                      }
                    } else {
                      const data = await res.json().catch(() => ({}));
                      toast({ title: "Erreur", description: data.error || "Erreur lors de la suppression du produit", variant: "destructive" });
                    }
                  }}>Supprimer</Button>
                  <Button variant="outline" onClick={() => setDeleteProduct(null)}>Annuler</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </section>
        )}
        {/* Modals d'édition/suppression ici */}
      </main>
    </div>
  )
} 