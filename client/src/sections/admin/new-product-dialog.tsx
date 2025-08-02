import { useCallback, useEffect } from 'react';
import { PRODUCT } from '../../types';
import { slugFormattedCorrectly } from '../../utils/utilities';
import { storage } from '../../utils/firebase';
import * as Yup from 'yup';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import axiosInstance from '../../utils/axios';
import { useAuthContext } from '../../auth/auth-context';
import { useSnackbar } from 'notistack';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material';
import FormProvider from '../../components/hook-form/FormProvider';
import RHFTextField from '../../components/hook-form/RHFTextField';
import RHFUpload from '../../components/hook-form/RHFUpload';
import { LoadingButton } from '@mui/lab';
import RHFAutocomplete from '../../components/hook-form/RHFAutocomplete';
import { COLORS, SIZES } from '../../utils/data';

interface NPD {
  open: boolean;
  closeDialog: () => void;
  selectedProduct: PRODUCT | null;
  setSelectedProduct: (product: PRODUCT | null) => void;
}

const NewProductDialog = ({ open, closeDialog, selectedProduct, setSelectedProduct }: NPD) => {

  const { manipulateProduct, categories } = useAuthContext();
    const { enqueueSnackbar } = useSnackbar();

    const ProductSchema = Yup.object().shape({
        _id: Yup.string(),
        name: Yup.string().required('name is required'),
        slug: Yup.string().required('Slug is required'),
        price: Yup.number().required('Price is required'),
        images: Yup.mixed(),
        categories: Yup.array(),
        sizes: Yup.array(),
        colors: Yup.array()
    });

    const defaultValues = { _id: '', name: '', slug: '', price: 0, images: '', categories: [], sizes: [], colors: [] };

    const methods = useForm({ resolver: yupResolver(ProductSchema), defaultValues });

    const { setValue, setError, handleSubmit, watch, reset, clearErrors, formState: { isSubmitting, errors } } = methods;

    const values = watch();

    const addImage = useCallback((acceptedFiles: any) => {
        const files = values.images || [];
  
        const newFiles = acceptedFiles.map((file: any) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
  
        setValue('images', [...files, ...newFiles], { shouldValidate: true });
      },
      [setValue, values.images]
    );

  const removeImage = useCallback((inputFile: any) => {
      const filtered = values.images?.filter((file: any) => file.name !== inputFile.name);
      setValue('images', filtered);
    },
    [setValue, values]
  );

  const uploadImages = async (files: any) => {
    const uploadedDocuments = files;
    for (let i = 0; i < files.length; i += 1) {
      if (files[i]?.name) {
        const documentRef = ref(storage, `products/${files[i].name}`);
        // const res = await uploadBytes(documentRef, files[i].document);
        const res = await uploadBytes(documentRef, files[i]);
        const documentUrl = await getDownloadURL(res.ref);
        uploadedDocuments[i] = documentUrl;
      }
    };
    return uploadedDocuments;
  }


    const closeHandler = () => {
        reset();
        setSelectedProduct(null);
        closeDialog();
    }

    const onSubmit = async (data: any) => {
        try {
            clearErrors('slug');
            const slugCorrect = slugFormattedCorrectly(data.slug);
            if (!slugCorrect) {
                setError('slug', { message: 'The slug should not include spaces' });
                return;
            };
            const submitForm = data;
            if (data.images) {
              const uploadedImages = await uploadImages(data.images);
              submitForm.images = uploadedImages;
            }
            if (selectedProduct?._id) {
                await axiosInstance.patch('/admin/edit-product', submitForm);
                manipulateProduct(submitForm, 'Edit');
            }
            if (!selectedProduct?._id) {
                const res = await axiosInstance.post('/admin/add-product', submitForm);
                manipulateProduct(res.data.product, 'Add');
            };
            enqueueSnackbar('Product Saved', { variant: 'success' })
            closeHandler();
        } catch (error: any) {
            setError('root', { ...error, message: error.message || error, });
        }
    };

    useEffect(() => {
        if (selectedProduct) {
            setValue('_id', selectedProduct._id);
            setValue('name', selectedProduct.name);
            setValue('slug', selectedProduct.slug);
            setValue('price', selectedProduct.price);
            setValue('images', selectedProduct.images);
            setValue('colors', selectedProduct.colors);
            setValue('categories', selectedProduct.categories);
            setValue('sizes', selectedProduct.sizes);
        }
    }, [selectedProduct]);

  return (
    <Dialog open={open} onClose={closeHandler}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <DialogTitle>{selectedProduct ? 'Edit' : 'Add a new'} product</DialogTitle>
            <DialogContent>
                <Stack gap={2}>
                    {!!errors.root && <Alert severity="error">{errors.root.message}</Alert>}
                    <RHFTextField name='name' label='Name' placeholder='Name' required />
                    <RHFTextField name='slug' label='Slug' placeholder='Slug' required />
                    <RHFTextField name='price' label='Price' placeholder='Price' type='number' required />
                    <RHFUpload name='images' accept={{ 'image/*': [] }} onDrop={addImage} multiple onRemove={removeImage} placeholder='Select Image' />
                    <RHFAutocomplete label='Categories' name='categories' placeholder='Categories' freeSolo multiple options={categories.map(cat => cat.name)} />
                    <RHFAutocomplete label='Sizes' name='sizes' placeholder='Sizes' freeSolo multiple options={SIZES} />
                    <RHFAutocomplete label='Colors' name='colors' placeholder='Colors' freeSolo multiple options={COLORS} />
                </Stack>
            </DialogContent>
            <DialogActions>
                {!isSubmitting && <Button onClick={closeHandler}>Cancel</Button>}
                <LoadingButton variant='contained' type='submit' loading={isSubmitting}>Save</LoadingButton>
            </DialogActions>
        </FormProvider>
    </Dialog>
  )
}

export default NewProductDialog