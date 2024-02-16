import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import { NavLink, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import IconUserPlus from '../../../components/Icon/IconUserPlus';
import IconListCheck from '../../../components/Icon/IconListCheck';
import IconLayoutGrid from '../../../components/Icon/IconLayoutGrid';
import IconSearch from '../../../components/Icon/IconSearch';
import IconUser from '../../../components/Icon/IconUser';
import IconFacebook from '../../../components/Icon/IconFacebook';
import IconInstagram from '../../../components/Icon/IconInstagram';
import IconLinkedin from '../../../components/Icon/IconLinkedin';
import IconTwitter from '../../../components/Icon/IconTwitter';
import IconX from '../../../components/Icon/IconX';
import axios from 'axios';
import config from '../../../congif/config';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { t } from 'i18next';

const Border = () => {
    const [addContactModal, setAddContactModal] = useState<any>(false);
    const [userData, setUserData] = useState<any>([]);
    const { t } = useTranslation();
    useEffect(() => {
        const fetch = async () => {
            const { data } = await axios.get(`${config.API_BASE_URL}/companies`);
            console.log(data);

            setUserData(data.data);
            console.log(userData);
        };
        fetch();
    }, []);
    useEffect(() => {
        console.log(userData);
    }, [userData , addContactModal]);

    const [value, setValue] = useState<any>('list');

    const [search, setSearch] = useState<any>('');


    const [company_id, setCompany_id] = useState<any>();

    const [isViewClicked, setViewClicked] = useState(false);

    // static for now

    const [filteredItems, setFilteredItems] = useState<any>(userData);
    console.log(filteredItems, 'filteredItems', userData);

    useEffect(() => {
        setFilteredItems(() => {
            return userData.filter((item: any) => {
                return item.businessName.toLowerCase().includes(search.toLowerCase());
            });
        });
    }, [search, userData]);
    const showMessage = (msg = '', type = 'success') => {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };

    const editHandler = (id: any) => {
        setCompany_id(id);
        setAddContactModal(true);
        console.log('edit', id);
        const admin = userData.find((ele: any) => ele.company_id === id);
        console.log(admin);
        formik.setValues(admin);
    };
    const deleteHandler = async (id: any) => {
        try {
            const response = await axios.delete(`${config.API_BASE_URL}/companies/${id}`);
            console.log(response);
            if (response.status === 200 || response.status === 201) {
                showMessage('admin has been deleted successfully.');

                // setUserData(userData.filter((item: any) => item.id !== id))
            }
        } catch (error) {
            // Handle error
            console.log('Error deleting admin:', error);
            showMessage('An error occurred while deleting the admin.');
        }
    };

    const formik = useFormik({
        initialValues: {},
        onSubmit: async (values: any, { resetForm }) => {
            try {
                // const formData: any = new FormData();
                // console.log(values, 'dfs');

                // Object.keys(values).forEach((ele) => {
                //     formData.append(ele, values[ele]);
                // });
                // console.log('dddd', formData);

                let update = await axios.put(`${config.API_BASE_URL}/companies/update/${company_id}`, values);
                console.log(update, 'ddddddddddddddddddd');

                if (update.status === 201 || update.status === 200) {
                    showMessage('admin has been updated successfully.');
                    setAddContactModal(false);
                    resetForm();
                }
            } catch (error) {
                for (const key in { ...formik.values }) {
                    !formik.values[key] ? showMessage(` ${key}`) : '';
                }
                console.error('Error submitting form:', error);
            }
        },
    });

    const viewHandler = (id: any) => {
        const admin = userData.find((ele: any) => ele.company_id === id);
        console.log(admin);
        formik.setValues(admin);
        setViewClicked(true);
        setAddContactModal(true);
    };

    return (
        <div>
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl">Admin</h2>
                <div className="flex sm:flex-row flex-col sm:items-center sm:gap-3 gap-4 w-full sm:w-auto">
                    <div className="flex gap-3">
                        <div>
                            <ul>
                                <li>
                                    <NavLink className="btn btn-primary" to="/location/country">
                                        <IconUserPlus className="ltr:mr-2 rtl:ml-2" /> Add New Admin
                                    </NavLink>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="relative">
                        <input type="text" placeholder="Search Contacts" className="form-input py-2 ltr:pr-11 rtl:pl-11 peer" value={search} onChange={(e) => setSearch(e.target.value)} />
                        <button type="button" className="absolute ltr:right-[11px] rtl:left-[11px] top-1/2 -translate-y-1/2 peer-focus:text-primary">
                            <IconSearch className="mx-auto" />
                        </button>
                    </div>
                </div>
            </div>
            {value === 'list' && (
                <div className="mt-5 panel p-0 border-0 overflow-hidden">
                    <div className="table-responsive">
                        <table className="table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>Company Name</th>
                                    <th>Contact Person Full Name</th>
                                    <th>business Type </th>
                                    <th>phone </th>
                                    <th>whatsapp Contact Number </th>
                                    <th>Email id </th>
                                    <th>status</th>
                                    <th>address</th>
                                    <th className="!text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.map((userData: any) => {
                                    return (
                                        <tr key={userData.id}>
                                            <td className="whitespace-nowrap">{userData.company_id}</td>
                                            <td className="whitespace-nowrap">{userData.businessName}</td>
                                            <td className="whitespace-nowrap">{userData.contactPersonFullName}</td>
                                            <td className="whitespace-nowrap">{userData.businessType}</td>
                                            <td className="whitespace-nowrap">{userData.phone}</td>
                                            <td className="whitespace-nowrap">{userData.whatsappContact}</td>
                                            <td className="whitespace-nowrap">{userData.email}</td>
                                            <td className="whitespace-nowrap">{userData.status}</td>
                                            <td className="whitespace-nowrap">{userData.address}</td>
                                            <td>
                                                <div className="flex gap-4 items-center justify-center">
                                                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => viewHandler(userData.company_id)}>
                                                        view
                                                    </button>
                                                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => editHandler(userData.company_id)}>
                                                        Edit
                                                    </button>
                                                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => deleteHandler(userData.company_id)}>
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {/* update model */}

            <Transition appear show={addContactModal} as={Fragment}>
                <Dialog
                    as="div"
                    open={addContactModal}
                    onClose={() => {
                        setAddContactModal(false);
                        setViewClicked(false);
                    }}
                    className="relative z-[51]"
                >
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-[black]/60" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center px-4 py-8">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg text-black dark:text-white-dark">
                                    <div className="p-5">
                                        {/* Form */}
                                        <form onSubmit={formik.handleSubmit} className="shadow-lg shadow-indigo-500/40 p-4 ">
                                            <div>
                                                <div className="grid mt-5 mr-20 ml-10 grid-cols-1 sm:grid-cols-1 gap-4 mr-5">
                                                    <div>
                                                        <label htmlFor="businessName">Business Name</label>
                                                        <input
                                                            id="businessName"
                                                            name="businessName"
                                                            onChange={formik.handleChange}
                                                            value={formik.values.businessName}
                                                            type="text"
                                                            placeholder="Enter business Name"
                                                            className="form-input"
                                                            readOnly={isViewClicked}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="businessName">BusinessType</label>
                                                        <input
                                                            id="businessName"
                                                            name="businessType"
                                                            onChange={formik.handleChange}
                                                            value={formik.values.businessType}
                                                            type="text"
                                                            placeholder="Enter business Type "
                                                            className="form-input"
                                                            readOnly={isViewClicked}
                                                            required
                                                        />
                                                    </div>
                                                    {/* <div>
                                <label htmlFor="businessLogo"> Business Logo </label>
                                <input
                                    id="businessLogo"
                                    className=" text-primary form-input"
                                    name="businessLogo"
                                    type="file"
                                    onChange={(event: any) => formik.setFieldValue('businessLogo', event.currentTarget.files[0])}
                                />
                            </div> */}
                                                </div>
                                                <div className="grid mt-4 mr-20 ml-10 grid-cols-1 sm:grid-cols-1 gap-4 mr-5">
                                                    <div>
                                                        <label htmlFor="contactPersonFullName">Contact Person Full Name</label>
                                                        <input
                                                            id="contactPersonFullName"
                                                            name="contactPersonFullName"
                                                            onChange={formik.handleChange}
                                                            value={formik.values.contactPersonFullName}
                                                            type="text"
                                                            placeholder="Enter Contact Person FullName "
                                                            className="form-input"
                                                            readOnly={isViewClicked}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid mt-4 mr-20 ml-10 grid-cols-1 sm:grid-cols-1 gap-4 mr-5"></div>
                                                <div className="grid mt-4 mr-20 ml-10 grid-cols-1 sm:grid-cols-1 gap-4 mr-5">
                                                    <div>
                                                        <label htmlFor="phone" className="ml-2">
                                                            Contact Number
                                                        </label>
                                                        <input
                                                            id="phone"
                                                            name="phone"
                                                            onChange={formik.handleChange}
                                                            value={formik.values.phone}
                                                            type="tel"
                                                            placeholder="Enter Contact Number"
                                                            className="form-input"
                                                            readOnly={isViewClicked}
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="whatsappContact" className="ml-2">
                                                            Whatsapp Contact Number
                                                        </label>
                                                        <input
                                                            id="whatsappContact"
                                                            name="whatsappContact"
                                                            onChange={formik.handleChange}
                                                            value={formik.values.whatsappContact}
                                                            type="text"
                                                            placeholder="Enter Whatsapp Contact Number"
                                                            className="form-input"
                                                            readOnly={isViewClicked}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="email" className="ml-2">
                                                            Email Address
                                                        </label>
                                                        <input
                                                            id="email"
                                                            name="email"
                                                            onChange={formik.handleChange}
                                                            value={formik.values.email}
                                                            type="text"
                                                            placeholder="Enter Email Address"
                                                            className="form-input"
                                                            readOnly={isViewClicked}
                                                        />
                                                    </div>
                                                </div>
                                                <div className=" mt-4 mr-5 ml-10 ">
                                                    <label htmlFor="address" className="mb-4 mt-5 flex flex-col items-center">
                                                        Address 1
                                                    </label>
                                                    <input
                                                        id="address"
                                                        name="address"
                                                        onChange={formik.handleChange}
                                                        value={formik.values.address}
                                                        type="text"
                                                        placeholder="Enter Address 1"
                                                        className="form-input"
                                                        readOnly={isViewClicked}
                                                    />
                                                </div>
                                                <div className="grid mt-4 mr-20 ml-10 grid-cols-1 sm:grid-cols-1 gap-4 mr-5">
                                                    <div>
                                                        <label htmlFor="routename" className="ml-2">
                                                            Country Name 1
                                                        </label>
                                                        <input
                                                            id="countryName"
                                                            name="countryName"
                                                            onChange={formik.handleChange}
                                                            value={formik.values.countryName}
                                                            type="tel"
                                                            placeholder="Enter Country Name 1"
                                                            className="form-input"
                                                            readOnly={isViewClicked}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="routename" className="ml-2">
                                                            State
                                                        </label>
                                                        <input
                                                            id="state"
                                                            name="state"
                                                            onChange={formik.handleChange}
                                                            value={formik.values.state}
                                                            type="text"
                                                            placeholder="Enter State Name"
                                                            className="form-input"
                                                            readOnly={isViewClicked}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="routename" className="ml-2">
                                                            City 1
                                                        </label>
                                                        <input
                                                            id="city"
                                                            name="city"
                                                            onChange={formik.handleChange}
                                                            value={formik.values.city}
                                                            type="text"
                                                            placeholder="Enter City Name 1"
                                                            className="form-input"
                                                            readOnly={isViewClicked}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="routename" className="ml-2">
                                                            Pincode Number
                                                        </label>
                                                        <input
                                                            id="pincode"
                                                            name="pincode"
                                                            onChange={formik.handleChange}
                                                            value={formik.values.pincode}
                                                            type="text"
                                                            placeholder="Enter PinCode 1"
                                                            className="form-input"
                                                            readOnly={isViewClicked}
                                                        />
                                                    </div>
                                                </div>
                                                <div className=" mt-4 mr-5 ml-10 ">
                                                    <div>
                                                        <label htmlFor="address" className="mb-4 mt-5 flex flex-col items-center">
                                                            Address 2
                                                        </label>
                                                        <input
                                                            id="address"
                                                            name="address"
                                                            onChange={formik.handleChange}
                                                            value={formik.values.address}
                                                            type="text"
                                                            placeholder="Enter Address 1"
                                                            className="form-input"
                                                            readOnly={isViewClicked}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid mt-4 mr-20 ml-10 grid-cols-1 sm:grid-cols-1 gap-4 mr-5">
                                                    <div>
                                                        <label htmlFor="countryName1" className="ml-2">
                                                            Country Name 2
                                                        </label>
                                                        <input
                                                            id="countryName1"
                                                            name="countryName1"
                                                            onChange={formik.handleChange}
                                                            value={formik.values.countryName1}
                                                            type="tel"
                                                            placeholder="Enter Country Name 1"
                                                            className="form-input"
                                                            readOnly={isViewClicked}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="routename" className="ml-2">
                                                            State 2
                                                        </label>
                                                        <input
                                                            id="state1"
                                                            name="state1"
                                                            onChange={formik.handleChange}
                                                            value={formik.values.state1}
                                                            type="text"
                                                            placeholder="Enter State Name 2"
                                                            className="form-input"
                                                            readOnly={isViewClicked}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="routename" className="ml-2">
                                                            City 2
                                                        </label>
                                                        <input
                                                            id="city1"
                                                            name="city1"
                                                            onChange={formik.handleChange}
                                                            value={formik.values.city1}
                                                            type="text"
                                                            placeholder="Enter City Name 1"
                                                            className="form-input"
                                                            readOnly={isViewClicked}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="routename" className="ml-2">
                                                            Pincode Number 2
                                                        </label>
                                                        <input
                                                            id="pincode1"
                                                            name="pincode1"
                                                            onChange={formik.handleChange}
                                                            value={formik.values.pincode1}
                                                            type="text"
                                                            placeholder="Enter PinCode 2"
                                                            className="form-input"
                                                            readOnly={isViewClicked}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mt-4 mr-5 ml-10 flex flex-col items-center">
                                                    <label htmlFor="routename" className="ml-2">
                                                        Tax Registration Number
                                                    </label>
                                                    <input
                                                        id="taxRegNo"
                                                        name="taxRegNo"
                                                        onChange={formik.handleChange}
                                                        value={formik.values.taxRegNo}
                                                        type="tel"
                                                        placeholder="Tax Registration Number"
                                                        className="form-input"
                                                        readOnly={isViewClicked}
                                                    />
                                                </div>
                                                {!isViewClicked && (
                                                    <div className="grid mt-4 mr-20 ml-10 mb-10 grid-cols-4 p-5 sm:grid-cols-1 gap-2 mr-5 mb-10">
                                                        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-auto w-100 mr-2 w-full ">
                                                            Update
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </form>

                                        {/* close form */}
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default Border;
