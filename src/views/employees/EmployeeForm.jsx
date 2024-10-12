import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CButton,
  CRow,
  CCol,
} from '@coreui/react'
import { CSpinner } from '@coreui/react'
import { useNavigate, useParams } from 'react-router-dom'
import apiService from '../../service/apiService.js'
import SalaryInput from '../../components/SalaryInput'

const EmployeeForm = ({ mode, employee, onSubmit }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ ...employee })

  useEffect(() => {
    setFormData({ ...employee }) // Update local state when employee prop changes
  }, [employee])

  const handleChange = (fieldName, value) => {
    
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }))
  }
  const onCancel = () => {
    navigate(-1)
  }

  return (
    <CCard>
      <CCardHeader as="h5" className="text-center">
        {mode === 'add' ? 'Add Employee' : mode === 'edit' ? 'Edit Employee' : 'View Employee'}
      </CCardHeader>
      <CCardBody>
        <CForm onSubmit={(e) => onSubmit(e, formData)}>
          {mode !== 'add' && (
            <CRow>
              <CCol md={6}>
                <CFormInput
                  name="employeeId"
                  type="text"
                  label="Employee ID"
                  value={formData.employeeId || ''}
                  disabled={true} // Disable input for both edit and view modes
                  required
                />
              </CCol>
            </CRow>
          )}
          <CRow>
            <CCol md={6}>
              <CFormInput
                type="text"
                label="Name"
                name="name"
                value={formData.name || ''}
                disabled={mode === 'view'}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </CCol>
            <CCol md={6}>
              <CFormInput
                type="email"
                label="Email"
                name="email"
                value={formData.email || ''}
                disabled={mode === 'view'}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            </CCol>
          </CRow>
          <CRow>
            <CCol md={6}>
              <CFormInput
                type="text"
                label="Job Title"
                name="jobTitle"
                value={formData.jobTitle || ''}
                disabled={mode === 'view'}
                onChange={(e) => handleChange('jobTitle', e.target.value)}
                required
              />
            </CCol>
            <CCol md={6}>
              <CFormInput
                type="text"
                label="Location"
                name="location"
                value={formData.location || ''}
                disabled={mode === 'view'}
                onChange={(e) => handleChange('location', e.target.value)}
                required
              />
            </CCol>
          </CRow>

          {/* Add Salary Input */}
          <CRow>
            <CCol md={6}>
              <SalaryInput
                value={formData.salary || ''}
                readOnly={mode === 'view'}
                name="salary"
                onChange={(e) => handleChange('salary', e)}
                required
                label="Salary"
              />
            </CCol>
          </CRow>

          {mode === 'view' && (
            <CRow>
              <CCol className="my-3">
                <CButton color="secondary" onClick={onCancel}>
                  Back
                </CButton>
              </CCol>
            </CRow>
          )}
          {mode !== 'view' && (
            <CRow>
              <CCol className="my-3">
                <CButton color="secondary" onClick={onCancel}>
                  Cancel
                </CButton>

                <CButton type="submit" color="primary" className="mx-3">
                  {mode === 'add' ? 'Add Employee' : 'Save Changes'}
                </CButton>
              </CCol>
            </CRow>
          )}
        </CForm>
      </CCardBody>
    </CCard>
  )
}

// AddEmployeePage Component
const AddEmployeePage = () => {
  return <EmployeeForm mode="add" employee={{}} onSubmit={handleAddEmployee} />
}

// ViewEmployeePage Component
const ViewEmployeePage = () => {
  const { id } = useParams()
  const [employeeData, setEmployeeData] = useState(null)

  useEffect(() => {
    const fetchEmployee = async () => {
      const result = await apiService.get(`/employee/${id}`)
      // Mock data for testing
      const data = {
        employeeId: result.id,
        ...result,
      }
      setEmployeeData(data)
    }
    fetchEmployee()
  }, [id])

  return employeeData ? (
    <EmployeeForm mode="view" employee={employeeData} onSubmit={null} />
  ) : (
    <CSpinner />
  )
}

// EditEmployeePage Component
import ToastNotification from '../../components/ToasterNotification.jsx'

const EditEmployeePage = () => {
  const { id } = useParams()
  const [employeeData, setEmployeeData] = useState(null)
  const [toastDeets, setToastDeets] = useState({})

  useEffect(() => {
    const fetchEmployee = async () => {
      const result = await apiService.get(`/employee/${id}`)
      // Mock data for testing
      const data = {
        employeeId: result.id,
        ...result,
      }
      setEmployeeData(data)
    }
    fetchEmployee()
  }, [id])

  const handleEditEmployee = async (event, data) => {
    event.preventDefault()

    try {
      const newData = {
        name: data.name,
        email: data.email,
        jobTitle: data.jobTitle,
        location: data.location,
        salary: data.salary,
      }

      await apiService.put('/employee/' + id, newData)

      setToastDeets({
        type: 'success',
        message: 'Employee updated succesfully',
        title: 'Edit Employee',
      })

    } catch (error) {

      setToastDeets({
        type: 'danger',
        message: 'An error occurred while updating the employee.',
        title: 'Edit Employee',
      })
    }
  }

  return employeeData ? (
    <>
      <EmployeeForm mode="edit" employee={employeeData} onSubmit={handleEditEmployee} />
      <ToastNotification deets={toastDeets} />
    </>
  ) : (
    <>
      <CSpinner />
      <ToastNotification deets={toastDeets} />
    </>
  )
}

// Placeholder functions for handling submit and cancel actions
const handleAddEmployee = (event) => {
  event.preventDefault()
  // Implement add employee logic here
}

export { AddEmployeePage, EditEmployeePage, ViewEmployeePage }
