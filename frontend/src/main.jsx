import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements } from 'react-router-dom'
import Layout from './Layout';
import {
  Login,
  Home,
  Jobs,
  ForgetPass,
  ForgetPin,
  Passchange,
  SignUp,
  VerifyUser,
  EditProfile,
  Profile,
  JobDetails,
  ApplyJob,
  Applications,
  AboutUs,
  ContactUs,
  TermsPolicies,
  HRDashboard,
  ViewCandidateApp,
  PostJob,
  ScheduleInterview
} from './index'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />}>
      <Route path='' element={<Home />} />
      <Route path='about-us' element={<AboutUs />} />
      <Route path='contact-us' element={<ContactUs />} />
      <Route path='terms-policies' element={<TermsPolicies />} />
      <Route path='login' element={<Login />} />
      <Route path='signup' element={<SignUp />} />
      <Route path='verify-user' element={<VerifyUser />} />
      <Route path='edit-profile' element={<EditProfile />} />
      <Route path='profile' element={<Profile />} />
      <Route path='applications' element={<Applications />} />
      <Route path='hr-dashboard' element={<HRDashboard />} />
      <Route path='view-application/:id' element={<ViewCandidateApp />} />
      <Route path='schedule-interview/:id' element={<ScheduleInterview />} />
      <Route path='post-job/:editId?' element={<PostJob />} />
      <Route path='job-details/:id' element={<JobDetails />} />
      <Route path='apply-job/:id' element={<ApplyJob />} />
      <Route path='forget-password' element={<ForgetPass />} />
      <Route path='reset-pin' element={<ForgetPin />} />
      <Route path='change-password' element={<Passchange />} />
      <Route path='jobs' element={<Jobs />} />
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
