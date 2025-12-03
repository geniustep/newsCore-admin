import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  Bars3Icon,
  ChevronDownIcon,
  ChevronRightIcon,
  LinkIcon,
  FolderIcon,
  TagIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { menusApi, categoriesApi, tagsApi, articlesApi } from '../lib/api';

interface MenuForm {
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  cssClass: string;
  theme: string;
}

interface MenuItemForm {
  label: string;
  labelAr: string;
  labelEn: string;
  labelFr: string;
  type: string;
  parentId?: string;
  url?: string;
  categoryId?: string;
  tagId?: string;
  articleId?: string;
  target: string;
  icon: string;
  imageUrl: string;
  description: string;
  cssClass: string;
  isMegaMenu: boolean;
  megaMenuLayout: string;
  isActive: boolean;
  isVisible: boolean;
  showOnMobile: boolean;
  showOnDesktop: boolean;
  sortOrder: number;
}

const MENU_LOCATIONS = [
  { value: 'header', label: 'الهيدر الرئيسي' },
  { value: 'header-secondary', label: 'الهيدر الثانوي' },
  { value: 'footer', label: 'الفوتر' },
  { value: 'footer-1', label: 'الفوتر - العمود 1' },
  { value: 'footer-2', label: 'الفوتر - العمود 2' },
  { value: 'footer-3', label: 'الفوتر - العمود 3' },
  { value: 'footer-4', label: 'الفوتر - العمود 4' },
  { value: 'sidebar-left', label: 'الشريط الجانبي الأيسر' },
  { value: 'sidebar-right', label: 'الشريط الجانبي الأيمن' },
  { value: 'mobile', label: 'قائمة الموبايل' },
  { value: 'topbar', label: 'الشريط العلوي' },
];

const MENU_ITEM_TYPES = [
  { value: 'CUSTOM', label: 'رابط مخصص', icon: LinkIcon },
  { value: 'CATEGORY', label: 'قسم', icon: FolderIcon },
  { value: 'TAG', label: 'وسم', icon: TagIcon },
  { value: 'ARTICLE', label: 'مقال', icon: DocumentTextIcon },
  { value: 'DIVIDER', label: 'فاصل', icon: Bars3Icon },
  { value: 'HEADING', label: 'عنوان', icon: DocumentTextIcon },
  { value: 'DYNAMIC', label: 'ديناميكي', icon: Bars3Icon },
];

export default function Menus() {
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingMenuId, setEditingMenuId] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const queryClient = useQueryClient();

  const menuForm = useForm<MenuForm>({
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      isActive: true,
      cssClass: '',
      theme: 'default',
    },
  });

  const itemForm = useForm<MenuItemForm>({
    defaultValues: {
      label: '',
      labelAr: '',
      labelEn: '',
      labelFr: '',
      type: 'CUSTOM',
      target: '_self',
      icon: '',
      imageUrl: '',
      description: '',
      cssClass: '',
      isMegaMenu: false,
      megaMenuLayout: 'grid-3',
      isActive: true,
      isVisible: true,
      showOnMobile: true,
      showOnDesktop: true,
      sortOrder: 0,
    },
  });

  const { data: menusData, isLoading: menusLoading } = useQuery({
    queryKey: ['menus'],
    queryFn: () => menusApi.getAll({}),
  });

  const { data: menuData, isLoading: menuLoading } = useQuery({
    queryKey: ['menu', selectedMenuId],
    queryFn: () => menusApi.getOne(selectedMenuId!),
    enabled: !!selectedMenuId,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(true),
  });

  const { data: tagsData } = useQuery({
    queryKey: ['tags'],
    queryFn: () => tagsApi.getAll(),
  });

  const createMenuMutation = useMutation({
    mutationFn: (data: any) => menusApi.create(data),
    onSuccess: () => {
      toast.success('تم إنشاء القائمة بنجاح');
      queryClient.invalidateQueries({ queryKey: ['menus'] });
      closeMenuModal();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const updateMenuMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      menusApi.update(id, data),
    onSuccess: () => {
      toast.success('تم تحديث القائمة بنجاح');
      queryClient.invalidateQueries({ queryKey: ['menus'] });
      queryClient.invalidateQueries({ queryKey: ['menu', selectedMenuId] });
      closeMenuModal();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const deleteMenuMutation = useMutation({
    mutationFn: (id: string) => menusApi.delete(id),
    onSuccess: () => {
      toast.success('تم حذف القائمة بنجاح');
      queryClient.invalidateQueries({ queryKey: ['menus'] });
      if (selectedMenuId === id) {
        setSelectedMenuId(null);
      }
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const createItemMutation = useMutation({
    mutationFn: ({ menuId, data }: { menuId: string; data: any }) =>
      menusApi.createItem(menuId, data),
    onSuccess: () => {
      toast.success('تم إضافة العنصر بنجاح');
      queryClient.invalidateQueries({ queryKey: ['menu', selectedMenuId] });
      closeItemModal();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      menusApi.updateItem(id, data),
    onSuccess: () => {
      toast.success('تم تحديث العنصر بنجاح');
      queryClient.invalidateQueries({ queryKey: ['menu', selectedMenuId] });
      closeItemModal();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: (id: string) => menusApi.deleteItem(id),
    onSuccess: () => {
      toast.success('تم حذف العنصر بنجاح');
      queryClient.invalidateQueries({ queryKey: ['menu', selectedMenuId] });
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const reorderItemsMutation = useMutation({
    mutationFn: ({ menuId, items }: { menuId: string; items: any[] }) =>
      menusApi.reorderItems(menuId, items),
    onSuccess: () => {
      toast.success('تم إعادة الترتيب بنجاح');
      queryClient.invalidateQueries({ queryKey: ['menu', selectedMenuId] });
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const openMenuModal = (menu?: any) => {
    if (menu) {
      setEditingMenuId(menu.id);
      menuForm.reset({
        name: menu.name,
        slug: menu.slug,
        description: menu.description || '',
        isActive: menu.isActive,
        cssClass: menu.cssClass || '',
        theme: menu.theme || 'default',
      });
    } else {
      setEditingMenuId(null);
      menuForm.reset({
        name: '',
        slug: '',
        description: '',
        isActive: true,
        cssClass: '',
        theme: 'default',
      });
    }
    setIsMenuModalOpen(true);
  };

  const closeMenuModal = () => {
    setIsMenuModalOpen(false);
    setEditingMenuId(null);
    menuForm.reset();
  };

  const openItemModal = (item?: any, parentId?: string) => {
    if (item) {
      setEditingItemId(item.id);
      itemForm.reset({
        label: item.label,
        labelAr: item.labelAr || '',
        labelEn: item.labelEn || '',
        labelFr: item.labelFr || '',
        type: item.type,
        parentId: item.parentId,
        url: item.url || '',
        categoryId: item.categoryId || '',
        tagId: item.tagId || '',
        articleId: item.articleId || '',
        target: item.target || '_self',
        icon: item.icon || '',
        imageUrl: item.imageUrl || '',
        description: item.description || '',
        cssClass: item.cssClass || '',
        isMegaMenu: item.isMegaMenu || false,
        megaMenuLayout: item.megaMenuLayout || 'grid-3',
        isActive: item.isActive,
        isVisible: item.isVisible,
        showOnMobile: item.showOnMobile,
        showOnDesktop: item.showOnDesktop,
        sortOrder: item.sortOrder || 0,
      });
    } else {
      setEditingItemId(null);
      itemForm.reset({
        label: '',
        labelAr: '',
        labelEn: '',
        labelFr: '',
        type: 'CUSTOM',
        parentId: parentId,
        target: '_self',
        icon: '',
        imageUrl: '',
        description: '',
        cssClass: '',
        isMegaMenu: false,
        megaMenuLayout: 'grid-3',
        isActive: true,
        isVisible: true,
        showOnMobile: true,
        showOnDesktop: true,
        sortOrder: 0,
      });
    }
    setIsItemModalOpen(true);
  };

  const closeItemModal = () => {
    setIsItemModalOpen(false);
    setEditingItemId(null);
    itemForm.reset();
  };

  const onMenuSubmit = (data: MenuForm) => {
    if (editingMenuId) {
      updateMenuMutation.mutate({ id: editingMenuId, data });
    } else {
      createMenuMutation.mutate(data);
    }
  };

  const onItemSubmit = (data: MenuItemForm) => {
    if (!selectedMenuId) {
      toast.error('يرجى اختيار قائمة أولاً');
      return;
    }

    const submitData: any = { ...data };
    if (data.type === 'CUSTOM') {
      delete submitData.categoryId;
      delete submitData.tagId;
      delete submitData.articleId;
    } else if (data.type === 'CATEGORY') {
      delete submitData.url;
      delete submitData.tagId;
      delete submitData.articleId;
    } else if (data.type === 'TAG') {
      delete submitData.url;
      delete submitData.categoryId;
      delete submitData.articleId;
    } else if (data.type === 'ARTICLE') {
      delete submitData.url;
      delete submitData.categoryId;
      delete submitData.tagId;
    } else {
      delete submitData.url;
      delete submitData.categoryId;
      delete submitData.tagId;
      delete submitData.articleId;
    }

    if (editingItemId) {
      updateItemMutation.mutate({ id: editingItemId, data: submitData });
    } else {
      createItemMutation.mutate({ menuId: selectedMenuId, data: submitData });
    }
  };

  const handleDeleteMenu = (id: string, name: string) => {
    if (confirm(`هل أنت متأكد من حذف القائمة "${name}"؟`)) {
      deleteMenuMutation.mutate(id);
    }
  };

  const handleDeleteItem = (id: string, label: string) => {
    if (confirm(`هل أنت متأكد من حذف العنصر "${label}"؟`)) {
      deleteItemMutation.mutate(id);
    }
  };

  const toggleItemExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const renderMenuItem = (item: any, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const TypeIcon = MENU_ITEM_TYPES.find((t) => t.value === item.type)?.icon || LinkIcon;

    return (
      <div key={item.id} className="border rounded-lg mb-2">
        <div
          className={`flex items-center gap-3 p-3 bg-white hover:bg-gray-50 ${
            level > 0 ? 'mr-4' : ''
          }`}
        >
          <button
            onClick={() => toggleItemExpanded(item.id)}
            className="p-1 hover:bg-gray-200 rounded"
          >
            {hasChildren ? (
              isExpanded ? (
                <ChevronDownIcon className="w-4 h-4" />
              ) : (
                <ChevronRightIcon className="w-4 h-4" />
              )
            ) : (
              <div className="w-4 h-4" />
            )}
          </button>
          <TypeIcon className="w-5 h-5 text-gray-400" />
          <div className="flex-1">
            <div className="font-medium">{item.label}</div>
            <div className="text-sm text-gray-500">
              {item.type} {item.url && `- ${item.url}`}
            </div>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => openItemModal(item)}
              className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded"
            >
              <PencilIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDeleteItem(item.id, item.label)}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
        {hasChildren && isExpanded && (
          <div className="border-t">
            {item.children.map((child: any) => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const menus = (menusData as any)?.data || [];
  const menu = (menuData as any)?.data;
  const categories = (categoriesData as any)?.data || [];
  const tags = (tagsData as any)?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة القوائم</h1>
          <p className="text-gray-500 mt-1">إدارة قوائم التنقل في الموقع</p>
        </div>
        <button
          onClick={() => openMenuModal()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          قائمة جديدة
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Menus List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <h2 className="font-semibold mb-4">القوائم</h2>
            {menusLoading ? (
              <div className="text-center py-8">جاري التحميل...</div>
            ) : menus.length === 0 ? (
              <div className="text-center py-8 text-gray-500">لا توجد قوائم</div>
            ) : (
              <div className="space-y-2">
                {menus.map((m: any) => (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMenuId(m.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedMenuId === m.id
                        ? 'bg-primary-50 border-2 border-primary-500'
                        : 'border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium">{m.name}</div>
                    <div className="text-sm text-gray-500">
                      {m._count?.items || 0} عنصر
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openMenuModal(m);
                        }}
                        className="p-1 text-gray-400 hover:text-primary-600"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMenu(m.id, m.name);
                        }}
                        className="p-1 text-gray-400 hover:text-red-600"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <div className="lg:col-span-2">
          {selectedMenuId ? (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg">
                  عناصر القائمة: {menu?.name}
                </h2>
                <button
                  onClick={() => openItemModal(undefined, undefined)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm"
                >
                  <PlusIcon className="w-4 h-4" />
                  إضافة عنصر
                </button>
              </div>
              {menuLoading ? (
                <div className="text-center py-8">جاري التحميل...</div>
              ) : !menu?.items || menu.items.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  لا توجد عناصر في هذه القائمة
                </div>
              ) : (
                <div className="space-y-2">
                  {menu.items.map((item: any) => renderMenuItem(item))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border p-12 text-center text-gray-500">
              اختر قائمة لعرض عناصرها
            </div>
          )}
        </div>
      </div>

      {/* Menu Modal */}
      {isMenuModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
              <h2 className="text-lg font-semibold">
                {editingMenuId ? 'تعديل القائمة' : 'قائمة جديدة'}
              </h2>
              <button
                onClick={closeMenuModal}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={menuForm.handleSubmit(onMenuSubmit)}
              className="p-4 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الاسم *
                </label>
                <input
                  {...menuForm.register('name', { required: 'الاسم مطلوب' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
                {menuForm.formState.errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {menuForm.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الرابط (Slug)
                </label>
                <input
                  {...menuForm.register('slug')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="سيتم إنشاؤه تلقائياً إذا تركت فارغاً"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الوصف
                </label>
                <textarea
                  {...menuForm.register('description')}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...menuForm.register('isActive')}
                    className="rounded"
                  />
                  <span className="text-sm">نشط</span>
                </label>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeMenuModal}
                  className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={createMenuMutation.isPending || updateMenuMutation.isPending}
                  className="flex-1 py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {createMenuMutation.isPending || updateMenuMutation.isPending
                    ? 'جاري الحفظ...'
                    : 'حفظ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Menu Item Modal */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
              <h2 className="text-lg font-semibold">
                {editingItemId ? 'تعديل العنصر' : 'عنصر جديد'}
              </h2>
              <button
                onClick={closeItemModal}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={itemForm.handleSubmit(onItemSubmit)}
              className="p-4 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  التسمية *
                </label>
                <input
                  {...itemForm.register('label', { required: 'التسمية مطلوبة' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    عربي
                  </label>
                  <input
                    {...itemForm.register('labelAr')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    English
                  </label>
                  <input
                    {...itemForm.register('labelEn')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Français
                  </label>
                  <input
                    {...itemForm.register('labelFr')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  النوع *
                </label>
                <select
                  {...itemForm.register('type', { required: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  {MENU_ITEM_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              {itemForm.watch('type') === 'CUSTOM' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الرابط *
                  </label>
                  <input
                    {...itemForm.register('url', {
                      required: itemForm.watch('type') === 'CUSTOM',
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="https://example.com"
                  />
                </div>
              )}
              {itemForm.watch('type') === 'CATEGORY' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    القسم *
                  </label>
                  <select
                    {...itemForm.register('categoryId', {
                      required: itemForm.watch('type') === 'CATEGORY',
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">اختر القسم</option>
                    {categories.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {itemForm.watch('type') === 'TAG' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الوسم *
                  </label>
                  <select
                    {...itemForm.register('tagId', {
                      required: itemForm.watch('type') === 'TAG',
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">اختر الوسم</option>
                    {tags.map((tag: any) => (
                      <option key={tag.id} value={tag.id}>
                        {tag.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الأيقونة
                  </label>
                  <input
                    {...itemForm.register('icon')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="home-icon"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الهدف
                  </label>
                  <select
                    {...itemForm.register('target')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="_self">نفس النافذة</option>
                    <option value="_blank">نافذة جديدة</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...itemForm.register('isActive')}
                    className="rounded"
                  />
                  <span className="text-sm">نشط</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...itemForm.register('isVisible')}
                    className="rounded"
                  />
                  <span className="text-sm">مرئي</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...itemForm.register('isMegaMenu')}
                    className="rounded"
                  />
                  <span className="text-sm">Mega Menu</span>
                </label>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeItemModal}
                  className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={
                    createItemMutation.isPending || updateItemMutation.isPending
                  }
                  className="flex-1 py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {createItemMutation.isPending || updateItemMutation.isPending
                    ? 'جاري الحفظ...'
                    : 'حفظ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

