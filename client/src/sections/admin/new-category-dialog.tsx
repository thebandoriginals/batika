import { useCallback, useEffect } from 'react';
import { CATEGORY } from '../../types';
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

interface NCD {
    open: boolean;
    closeDialog: () => void;
    selectedCategory: CATEGORY | null;
    setSelectedCategory: (category: CATEGORY | null) => void;
}

const NewCategoryDialog = ({ closeDialog, open, selectedCategory, setSelectedCategory }: NCD) => {

    const { manipulateCategory } = useAuthContext();
    const { enqueueSnackbar } = useSnackbar();

    const CategorySchema = Yup.object().shape({
        _id: Yup.string(),
        name: Yup.string().required('name is required'),
        slug: Yup.string().required('Slug is required'),
        image: Yup.mixed(),
    });

    const defaultValues = { _id: '', name: '', slug: '', image: '' };

    const methods = useForm({ resolver: yupResolver(CategorySchema), defaultValues });

    const { setValue, setError, handleSubmit, reset, clearErrors, formState: { isSubmitting, errors } } = methods;

    const handleDrop = useCallback((acceptedFiles: any) => {
        const file = acceptedFiles[0];
        const newFile = Object.assign(file, { preview: URL.createObjectURL(file), });
        if (file) setValue('image', newFile, { shouldValidate: true });
      },
        [setValue]
    );

    const removeImage = () => {
        setValue('image', null);
    }

    const uploadImage = async (file: any) => {
        const documentRef = ref(storage, `categories/${file.name}`);
        const res = await uploadBytes(documentRef, file);
        const documentUrl = await getDownloadURL(res.ref);
        return documentUrl;
    };

    const closeHandler = () => {
        reset();
        setSelectedCategory(null);
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
            if (data?.image && data?.image?.name) {
                const url = await uploadImage(data?.image);
                submitForm.image = url;
            };
            if (selectedCategory?._id) {
                await axiosInstance.patch('/admin/edit-category', submitForm);
                manipulateCategory(submitForm, 'Edit');
            }
            if (!selectedCategory?._id) {
                const res = await axiosInstance.post('/admin/add-category', submitForm);
                manipulateCategory(res.data.category, 'Add');
            };
            enqueueSnackbar('Product Saved', { variant: 'success' })
            closeHandler();
        } catch (error: any) {
            setError('root', { ...error, message: error.message || error, });
        }
    };

    useEffect(() => {
        if (selectedCategory) {
            setValue('_id', selectedCategory._id);
            setValue('image', selectedCategory.image);
            setValue('name', selectedCategory.name);
            setValue('slug', selectedCategory.slug);
        }
    }, [selectedCategory]);

  return (
    <Dialog open={open} onClose={closeHandler}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <DialogTitle>{selectedCategory ? 'Edit' : 'Add a new'} category</DialogTitle>
            <DialogContent>
                <Stack gap={2}>
                    {!!errors.root && <Alert severity="error">{errors.root.message}</Alert>}
                    <RHFTextField name='name' label='Name' placeholder='Name' required />
                    <RHFTextField name='slug' label='Slug' placeholder='Slug' required />
                    <RHFUpload name='image' accept={{ 'image/*': [] }} onDrop={handleDrop} onDelete={removeImage} placeholder='Select Image' />
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

export default NewCategoryDialog