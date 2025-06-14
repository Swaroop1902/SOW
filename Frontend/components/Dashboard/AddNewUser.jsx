'use client';
import React, { useState, useEffect } from 'react';
import styles from './AddNewUser.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const AddNewUser = ({ onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    deliveryUnit: '',
  });

  const [roles, setRoles] = useState([]);
  const [deliveryUnits, setDeliveryUnits] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/delivery-units`)
      .then((res) => res.json())
      .then((data) => setDeliveryUnits(data))
      .catch((err) => console.error('Error fetching delivery units:', err));
    // setDeliveryUnits([
    //   'Delivery Unit 1',
    //   'Delivery Unit 2',
    //   'Delivery Unit 3',
    //   'Delivery Unit 4',
    //   'Delivery Unit 5'
    // ]);
    setDeliveryUnits([
  { label: 'Delivery Unit 1', value: 'DU-1' },
  { label: 'Delivery Unit 2', value: 'DU-2' },
  { label: 'Delivery Unit 3', value: 'DU-3' },
  { label: 'Delivery Unit 4', value: 'DU-4' },
  { label: 'Delivery Unit 5', value: 'DU-5' }
]);
    setRoles(['Delivery Manager', 'Delivery Head']);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.role || !formData.deliveryUnit) {
      setError('Please fill out all fields.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          role: formData.role,
          delivery_unit: formData.deliveryUnit,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setError('');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          role: '',
          deliveryUnit: '',
        });

        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to add the user. Please try again.');
      }
    } catch (err) {
      console.error('Error adding user:', err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          Create New User
          <button className={styles.closeBtn} onClick={onClose}>
            ✖
          </button>
        </div>

        <div className={styles.modalContent}>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email ID</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="role">Role</label>
              <select id="role" name="role" value={formData.role} onChange={handleChange} required>
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="deliveryUnit">Delivery Unit</label>
              {/* <select
                id="deliveryUnit"
                name="deliveryUnit"
                value={formData.deliveryUnit}
                onChange={handleChange}
                required
              >
                <option value="">Select Delivery Unit</option>
                {deliveryUnits.map((unit, index) => (
                  <option key={index} value={unit}>
                    {unit}
                  </option>
                ))}
              </select> */}
              <select
  id="deliveryUnit"
  name="deliveryUnit"
  value={formData.deliveryUnit}
  onChange={handleChange}
  required
>
  <option value="">Select Delivery Unit</option>
  {deliveryUnits.map((unit, index) => (
    <option key={index} value={unit.value}>
      {unit.label}
    </option>
  ))}
</select>
            </div>

            {error && <p className={styles.error}>{error}</p>}
            {success && <p className={styles.success}>User added successfully!</p>}

            <div className={styles.formButtons}>
              <button type="submit" className={`${styles.button} ${styles.submitBtn}`}>
                Submit
              </button>
              <button
                type="button"
                className={`${styles.button} ${styles.cancelBtn}`}
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddNewUser;
