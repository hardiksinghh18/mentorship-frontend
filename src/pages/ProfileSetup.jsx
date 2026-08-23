import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLoggedIn } from "../redux/actions/authActions";
import { FiUser, FiBriefcase, FiTool, FiEdit, FiBookOpen, FiPlus, FiTrash2, FiMapPin, FiLinkedin, FiGithub, FiTwitter, FiLink, FiMail, FiX } from "react-icons/fi";

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import LoadingButton from '@mui/lab/LoadingButton';
import { Select, MenuItem, FormControl, Chip } from '@mui/material';
import dayjs from 'dayjs';
import { profileSchema } from "../utils/formValidation";

const ProfileSetup = () => {
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [skillInput, setSkillInput] = useState("");
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    role: user?.role || "",
    skills: Array.isArray(user?.skills) ? user.skills : (user?.skills ? user.skills.split(",").map(s => s.trim()).filter(s => s !== "") : []),
    bio: user?.bio || "",
    education: Array.isArray(user?.education) ? user.education : [],
    experience: Array.isArray(user?.experience) ? user.experience : [],
    socialLinks: (typeof user?.socialLinks === 'string' ? JSON.parse(user.socialLinks) : user?.socialLinks) || { linkedin: "", github: "", twitter: "", portfolio: "" },
  });

  useEffect(() => {
    if (!isLoggedIn) navigate("/login");
  }, [isLoggedIn, navigate]);

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = skillInput.trim();
      if (value) {
        const skillsToAdd = value.split(',').map(s => s.trim()).filter(s => s !== "");
        const existingSkillsLower = formData.skills.map(s => s.toLowerCase());

        const newSkills = skillsToAdd.filter(s => !existingSkillsLower.includes(s.toLowerCase()));
        const duplicates = skillsToAdd.filter(s => existingSkillsLower.includes(s.toLowerCase()));

        if (newSkills.length > 0) {
          setFormData({ ...formData, skills: [...formData.skills, ...newSkills] });
          if (errors.skills) setErrors({ ...errors, skills: "" });
          setSkillInput("");
        } else if (duplicates.length > 0) {
          toast.info("Skill already added");
          setSkillInput("");
        }
      }
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Education Handlers
  const handleAddEducation = () => {
    setFormData({
      ...formData,
      education: [
        ...formData.education,
        { degree: "", field: "", college: "", startYear: null, endYear: null },
      ],
    });
  };

  const handleRemoveEducation = (index) => {
    const newEducation = formData.education.filter((_, i) => i !== index);
    setFormData({ ...formData, education: newEducation });
  };

  const handleEducationChange = (index, field, value) => {
    const newEducation = [...formData.education];
    newEducation[index][field] = value;
    setFormData({ ...formData, education: newEducation });
    if (errors[`education.${index}.${field}`]) {
      setErrors({ ...errors, [`education.${index}.${field}`]: "" });
    }
  };

  // Experience Handlers
  const handleAddExperience = () => {
    setFormData({
      ...formData,
      experience: [
        ...formData.experience,
        { company: "", role: "", location: "", employmentType: "Full-time", startDate: null, endDate: null, currentlyWorking: false },
      ],
    });
  };

  const handleRemoveExperience = (index) => {
    const newExperience = formData.experience.filter((_, i) => i !== index);
    setFormData({ ...formData, experience: newExperience });
  };

  const handleExperienceChange = (index, field, value) => {
    const newExperience = [...formData.experience];
    newExperience[index][field] = value;
    if (field === 'currentlyWorking' && value === true) {
      newExperience[index].endDate = null;
    }
    setFormData({ ...formData, experience: newExperience });
    if (errors[`experience.${index}.${field}`]) {
      setErrors({ ...errors, [`experience.${index}.${field}`]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Zod Validation
    const result = profileSchema.safeParse(formData);

    if (!result.success) {
      const newErrors = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join('.');
        newErrors[path] = issue.message;
      });
      setErrors(newErrors);
      toast.error("Please fix the validation errors");
      return;
    }

    setLoading(true);
    try {
      const submissionData = {
        ...formData,
        skills: typeof formData.skills === 'string' ? formData.skills.split(",").map(s => s.trim()).filter(s => s !== "") : formData.skills,
        socialLinks: formData.socialLinks,
      };

      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/profile/update/${user.email}`,
        submissionData,
        { withCredentials: true }
      );

      if (response.data.loggedIn) {
        toast.success(response.data.message);
        dispatch(setLoggedIn());
        setTimeout(() => navigate(`/profile/${user.username}`), 2000);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex items-center justify-center p-6 sm:p-12">
      <div className="w-full max-w-4xl bg-zinc-50 rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-10 md:p-16">
          <div className="flex flex-col gap-2 mb-10">
            <h1 className="text-xl md:text-2xl font-black text-zinc-900 tracking-tighter leading-none">
              Update Profile Info
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-12">
            <div className="space-y-8">
              {/* Name Field */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-zinc-700 ml-1">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors">
                    <FiUser size={18} />
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Enter full name"
                    className={`w-full pl-12 pr-6 py-4 bg-zinc-100 rounded-lg border text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:bg-white transition-all outline-none font-bold ${errors.fullName ? 'border-rose-500' : 'border-zinc-300'}`}
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
                {errors.fullName && <p className="text-xs text-rose-500 font-semibold mt-2 ml-1">{errors.fullName}</p>}
              </div>

              {/* Email Field (Disabled) */}
              <div className="space-y-3 opacity-60">
                <label className="text-xs font-bold text-zinc-700 ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-400 transition-colors">
                    <FiMail size={18} />
                  </div>
                  <input
                    type="email"
                    className="w-full pl-12 pr-6 py-4 bg-zinc-200/60 rounded-lg border border-zinc-300 text-zinc-700 font-bold outline-none cursor-not-allowed"
                    value={user?.email || ""}
                    disabled
                    readOnly
                  />
                </div>
              </div>

              {/* Role Select */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-zinc-700 ml-1">Current Role</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors z-10 pointer-events-none">
                    <FiBriefcase size={18} />
                  </div>
                  <FormControl fullWidth>
                    <Select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      displayEmpty
                      className={`w-full pl-10 pr-6 py-0 bg-zinc-100 rounded-lg border text-zinc-900 focus:border-zinc-500 focus:bg-white transition-all outline-none font-bold ${errors.role ? 'border-rose-500' : 'border-zinc-300'}`}
                      sx={{
                        '& .MuiSelect-select': {
                          py: 1.8,
                          pl: 6,
                          color: '#18181b',
                          fontWeight: 700,
                          backgroundColor: 'transparent'
                        },
                        '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
                        '& .MuiSvgIcon-root': { color: '#71717a' },
                        borderRadius: '8px'
                      }
                      }
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            bgcolor: '#ffffff',
                            border: '1px solid #e4e4e7',
                            borderRadius: '8px',
                            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                            mt: 1,
                            '& .MuiMenuItem-root': {
                              fontSize: '13px',
                              fontWeight: 700,
                              color: '#27272a',
                              py: 1.5,
                              '&:hover': { bgcolor: '#f4f4f5', color: '#000000' },
                              '&.Mui-selected': { bgcolor: '#e4e4e7', color: '#000000' },
                              '&.Mui-selected:hover': { bgcolor: '#d4d4d8' }
                            }
                          }
                        }
                      }}
                    >
                      <MenuItem value="" disabled>Select Role</MenuItem>
                      <MenuItem value="mentor">Mentor</MenuItem>
                      <MenuItem value="mentee">Mentee</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                {errors.role && <p className="text-xs text-rose-500 font-semibold mt-2 ml-1">{errors.role}</p>}
              </div>

              {/* Skills Field */}
              <div className="space-y-4">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-zinc-700 ml-1">Skills</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors">
                      <FiTool size={18} />
                    </div>
                    <input
                      type="text"
                      placeholder="Type a skill and press Enter..."
                      className={`w-full pl-12 pr-6 py-4 bg-zinc-100 rounded-lg border text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:bg-white transition-all outline-none font-bold ${errors.skills ? 'border-rose-500' : 'border-zinc-300'}`}
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={handleSkillKeyDown}
                    />
                    {skillInput.trim() && (
                      <div className="absolute right-4 inset-y-0 flex items-center">
                        <span className="text-[10px] font-semibold text-zinc-600 bg-zinc-200 px-2 py-1 rounded border border-zinc-300">Press Enter</span>
                      </div>
                    )}
                  </div>
                  {errors.skills && <p className="text-xs text-rose-500 font-semibold mt-2 ml-1">{errors.skills}</p>}
                </div>

                {/* Skill Chips */}
                <div className="flex flex-wrap gap-2 min-h-[20px]">
                  {formData.skills.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      onDelete={() => handleRemoveSkill(skill)}
                      deleteIcon={<FiX size={14} />}
                      sx={{
                        bgcolor: '#f4f4f5',
                        color: '#27272a',
                        fontWeight: 600,
                        fontSize: '11px',
                        textTransform: 'none',
                        letterSpacing: 'normal',
                        borderRadius: '6px',
                        border: '1px solid #e4e4e7',
                        height: '32px',
                        '& .MuiChip-label': { px: 1.5 },
                        '& .MuiChip-deleteIcon': {
                          color: '#71717a',
                          transition: 'all 0.2s',
                          ml: -0.5,
                          mr: 0.5,
                          '&:hover': { color: '#e11d48' }
                        },
                        '&:hover': {
                          bgcolor: '#e4e4e7',
                          borderColor: '#d4d4d8',
                          color: '#000000'
                        }
                      }}
                    />
                  ))}
                  {formData.skills.length === 0 && !skillInput && (
                    <p className="text-xs text-zinc-400 font-semibold ml-1 italic">No skills added yet</p>
                  )}
                </div>
              </div>

              {/* Experience Section */}
              <div className="space-y-6 pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-zinc-700 ml-1">Experience</label>
                    <span className="text-[10px] font-semibold text-zinc-400 ml-1 mt-1">(Optional)</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddExperience}
                    className="flex items-center gap-2 text-xs font-semibold text-zinc-900 bg-zinc-200 border border-zinc-300 px-4 py-2 rounded-full hover:bg-zinc-300 transition-all"
                  >
                    <FiPlus size={14} /> Add Experience
                  </button>
                </div>

                {formData.experience.map((exp, index) => (
                  <div key={index} className="p-6 bg-zinc-100/60 rounded-lg border border-zinc-300 space-y-6 relative group/edu">
                    <button
                      type="button"
                      onClick={() => handleRemoveExperience(index)}
                      className="absolute top-6 right-6 text-zinc-500 hover:text-red-500 transition-colors"
                    >
                      <FiTrash2 size={18} />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-600 ml-1">Job Role *</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-400">
                            <FiBriefcase size={16} />
                          </div>
                          <input
                            type="text"
                            placeholder="e.g. Software Engineer"
                            className={`w-full pl-12 pr-6 py-3 bg-white rounded-lg border text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 transition-all outline-none text-sm font-bold ${errors[`experience.${index}.role`] ? 'border-rose-500' : 'border-zinc-300'}`}
                            value={exp.role}
                            onChange={(e) => handleExperienceChange(index, 'role', e.target.value)}
                            required
                          />
                        </div>
                        {errors[`experience.${index}.role`] && <p className="text-xs text-rose-500 font-semibold mt-1 ml-1">{errors[`experience.${index}.role`]}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-600 ml-1">Company *</label>
                        <input
                          type="text"
                          placeholder="e.g. Google"
                          className={`w-full px-6 py-3 bg-white rounded-lg border text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 transition-all outline-none text-sm font-bold ${errors[`experience.${index}.company`] ? 'border-rose-500' : 'border-zinc-300'}`}
                          value={exp.company}
                          onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                          required
                        />
                        {errors[`experience.${index}.company`] && <p className="text-xs text-rose-500 font-semibold mt-1 ml-1">{errors[`experience.${index}.company`]}</p>}
                      </div>
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-600 ml-1">Location</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-400">
                            <FiMapPin size={16} />
                          </div>
                          <input
                            type="text"
                            placeholder="e.g. London, UK"
                            className="w-full pl-12 pr-6 py-3 bg-white rounded-lg border border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 transition-all outline-none text-sm font-bold"
                            value={exp.location}
                            onChange={(e) => handleExperienceChange(index, 'location', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-600 ml-1">Employment Type</label>
                        <FormControl fullWidth>
                          <Select
                            value={exp.employmentType}
                            onChange={(e) => handleExperienceChange(index, 'employmentType', e.target.value)}
                            className="w-full bg-white rounded-lg border border-zinc-300 text-zinc-900 focus:border-zinc-500 transition-all outline-none text-sm font-bold"
                            sx={{
                              '& .MuiSelect-select': { py: 1.5, px: 3, color: '#18181b', fontWeight: 700 },
                              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                              '& .MuiSvgIcon-root': { color: '#71717a' },
                              borderRadius: '8px'
                            }}
                            MenuProps={{
                              PaperProps: {
                                sx: {
                                  bgcolor: '#ffffff',
                                  border: '1px solid #e4e4e7',
                                  borderRadius: '8px',
                                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                                  '& .MuiMenuItem-root': {
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    color: '#27272a',
                                    '&:hover': { bgcolor: '#f4f4f5', color: '#000000' }
                                  }
                                }
                              }
                            }}
                          >
                            <MenuItem value="Full-time">Full-time</MenuItem>
                            <MenuItem value="Part-time">Part-time</MenuItem>
                            <MenuItem value="Internship">Internship</MenuItem>
                            <MenuItem value="Contract">Contract</MenuItem>
                            <MenuItem value="Freelance">Freelance</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-2">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-600 ml-1">Start Date *</label>
                        <DatePicker
                          views={['year', 'month']}
                          value={exp.startDate ? dayjs(exp.startDate) : null}
                          onChange={(newValue) => handleExperienceChange(index, 'startDate', newValue)}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              size: 'small',
                              sx: {
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: '8px',
                                  bgcolor: '#ffffff',
                                  '& fieldset': { border: errors[`experience.${index}.startDate`] ? '1px solid #f43f5e' : '1px solid #d4d4d8' },
                                  '&:hover fieldset': { borderColor: '#a1a1aa' },
                                  '&.Mui-focused fieldset': { borderColor: '#18181b' },
                                  '& .MuiInputBase-input': { color: '#18181b', fontWeight: 700, fontSize: '13px' },
                                  '& .MuiSvgIcon-root': { color: '#71717a' }
                                }
                              }
                            }
                          }}
                        />
                        {errors[`experience.${index}.startDate`] && <p className="text-xs text-rose-500 font-semibold mt-1 ml-1">{errors[`experience.${index}.startDate`]}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-600 ml-1">End Date *</label>
                        <DatePicker
                          views={['year', 'month']}
                          value={exp.endDate ? dayjs(exp.endDate) : null}
                          disabled={exp.currentlyWorking}
                          onChange={(newValue) => handleExperienceChange(index, 'endDate', newValue)}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              size: 'small',
                              sx: {
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: '8px',
                                  bgcolor: exp.currentlyWorking ? '#e4e4e7' : '#ffffff',
                                  opacity: exp.currentlyWorking ? 0.5 : 1,
                                  '& fieldset': { border: errors[`experience.${index}.endDate`] ? '1px solid #f43f5e' : '1px solid #d4d4d8' },
                                  '&:hover fieldset': { borderColor: '#a1a1aa' },
                                  '&.Mui-focused fieldset': { borderColor: '#18181b' },
                                  '& .MuiInputBase-input': { color: '#18181b', fontWeight: 700, fontSize: '13px' },
                                  '& .MuiSvgIcon-root': { color: '#71717a' }
                                }
                              }
                            }
                          }}
                        />
                        {errors[`experience.${index}.endDate`] && <p className="text-xs text-rose-500 font-semibold mt-1 ml-1">{errors[`experience.${index}.endDate`]}</p>}

                        <div className="flex items-center gap-3 !mt-4 ml-1">
                          <input
                            type="checkbox"
                            id={`curr-${index}`}
                            className="w-4 h-4 rounded border-zinc-300 bg-zinc-100 accent-zinc-900 cursor-pointer"
                            checked={exp.currentlyWorking}
                            onChange={(e) => handleExperienceChange(index, 'currentlyWorking', e.target.checked)}
                          />
                          <label htmlFor={`curr-${index}`} className="text-xs font-semibold text-zinc-600 cursor-pointer hover:text-zinc-900 transition-colors">Currently working here</label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {formData.experience.length === 0 && (
                  <div className="py-12 border-2 border-dashed border-zinc-300 rounded-lg flex flex-col items-center justify-center text-zinc-500">
                    <FiBriefcase size={32} className="mb-4 opacity-40 text-zinc-400" />
                    <p className="text-xs font-semibold text-zinc-500">No Experience Added</p>
                  </div>
                )}
              </div>

              {/* Education Section */}
              <div className="space-y-6 pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-zinc-700 ml-1">Education</label>
                    <span className="text-[10px] font-semibold text-zinc-400 ml-1 mt-1">(Optional)</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddEducation}
                    className="flex items-center gap-2 text-xs font-semibold text-zinc-900 bg-zinc-200 border border-zinc-300 px-4 py-2 rounded-full hover:bg-zinc-300 transition-all"
                  >
                    <FiPlus size={14} /> Add Education
                  </button>
                </div>

                {formData.education.map((edu, index) => (
                  <div key={index} className="p-6 bg-zinc-100/60 rounded-lg border border-zinc-300 space-y-6 relative group/edu">
                    <button
                      type="button"
                      onClick={() => handleRemoveEducation(index)}
                      className="absolute top-6 right-6 text-zinc-500 hover:text-red-500 transition-colors"
                    >
                      <FiTrash2 size={18} />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-600 ml-1">Degree *</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-400">
                            <FiBookOpen size={16} />
                          </div>
                          <input
                            type="text"
                            placeholder="e.g. B.Tech"
                            className={`w-full pl-12 pr-6 py-3 bg-white rounded-lg border text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 transition-all outline-none text-sm font-bold ${errors[`education.${index}.degree`] ? 'border-rose-500' : 'border-zinc-300'}`}
                            value={edu.degree}
                            onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                            required
                          />
                        </div>
                        {errors[`education.${index}.degree`] && <p className="text-xs text-rose-500 font-semibold mt-1 ml-1">{errors[`education.${index}.degree`]}</p>}
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-600 ml-1">Field of Study</label>
                        <input
                          type="text"
                          placeholder="e.g. Computer Science"
                          className="w-full px-6 py-3 bg-white rounded-lg border border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 transition-all outline-none text-sm font-bold"
                          value={edu.field}
                          onChange={(e) => handleEducationChange(index, 'field', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-600 ml-1">College *</label>
                      <input
                        type="text"
                        placeholder="Enter college name"
                        className={`w-full px-6 py-3 bg-white rounded-lg border text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 transition-all outline-none text-sm font-bold ${errors[`education.${index}.college`] ? 'border-rose-500' : 'border-zinc-300'}`}
                        value={edu.college}
                        onChange={(e) => handleEducationChange(index, 'college', e.target.value)}
                        required
                      />
                      {errors[`education.${index}.college`] && <p className="text-xs text-rose-500 font-semibold mt-1 ml-1">{errors[`education.${index}.college`]}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-2">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-600 ml-1">Start Date *</label>
                        <DatePicker
                          views={['year', 'month']}
                          value={edu.startYear ? dayjs(edu.startYear) : null}
                          onChange={(newValue) => handleEducationChange(index, 'startYear', newValue)}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              size: 'small',
                              sx: {
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: '8px',
                                  bgcolor: '#ffffff',
                                  '& fieldset': { border: errors[`education.${index}.startYear`] ? '1px solid #f43f5e' : '1px solid #d4d4d8' },
                                  '&:hover fieldset': { borderColor: '#a1a1aa' },
                                  '&.Mui-focused fieldset': { borderColor: '#18181b' },
                                  '& .MuiInputBase-input': { color: '#18181b', fontWeight: 700, fontSize: '13px' },
                                  '& .MuiSvgIcon-root': { color: '#71717a' }
                                }
                              }
                            }
                          }}
                        />
                        {errors[`education.${index}.startYear`] && <p className="text-xs text-rose-500 font-semibold mt-1 ml-1">{errors[`education.${index}.startYear`]}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-600 ml-1">End Date *</label>
                        <DatePicker
                          views={['year', 'month']}
                          value={edu.endYear ? dayjs(edu.endYear) : null}
                          onChange={(newValue) => handleEducationChange(index, 'endYear', newValue)}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              size: 'small',
                              sx: {
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: '8px',
                                  bgcolor: '#ffffff',
                                  '& fieldset': { border: errors[`education.${index}.endYear`] ? '1px solid #f43f5e' : '1px solid #d4d4d8' },
                                  '&:hover fieldset': { borderColor: '#a1a1aa' },
                                  '&.Mui-focused fieldset': { borderColor: '#18181b' },
                                  '& .MuiInputBase-input': { color: '#18181b', fontWeight: 700, fontSize: '13px' },
                                  '& .MuiSvgIcon-root': { color: '#71717a' }
                                }
                              }
                            }
                          }}
                        />
                        {errors[`education.${index}.endYear`] && <p className="text-xs text-rose-500 font-semibold mt-1 ml-1">{errors[`education.${index}.endYear`]}</p>}
                      </div>
                    </div>
                  </div>
                ))}

                {formData.education.length === 0 && (
                  <div className="py-12 border-2 border-dashed border-zinc-300 rounded-lg flex flex-col items-center justify-center text-zinc-500">
                    <FiBookOpen size={32} className="mb-4 opacity-40 text-zinc-400" />
                    <p className="text-xs font-semibold text-zinc-500">No Education Added</p>
                  </div>
                )}
              </div>

              {/* Social Links Section */}
              <div className="space-y-6 pt-4">
                <label className="text-xs font-bold text-zinc-700 ml-1">Social Presence</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* LinkedIn */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-400 group-focus-within:text-[#0077b5] transition-colors">
                      <FiLinkedin size={18} />
                    </div>
                    <input
                      type="url"
                      placeholder="LinkedIn URL"
                      className={`w-full pl-12 pr-6 py-4 bg-zinc-100 rounded-lg border text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:bg-white transition-all outline-none font-bold ${errors['socialLinks.linkedin'] ? 'border-rose-500' : 'border-zinc-300'}`}
                      value={formData.socialLinks.linkedin}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          socialLinks: { ...formData.socialLinks, linkedin: e.target.value }
                        });
                        if (errors['socialLinks.linkedin']) setErrors({ ...errors, 'socialLinks.linkedin': '' });
                      }}
                    />
                    {errors['socialLinks.linkedin'] && <p className="text-xs text-rose-500 font-semibold mt-2 ml-1">{errors['socialLinks.linkedin']}</p>}
                  </div>

                  {/* GitHub */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors">
                      <FiGithub size={18} />
                    </div>
                    <input
                      type="url"
                      placeholder="GitHub URL"
                      className={`w-full pl-12 pr-6 py-4 bg-zinc-100 rounded-lg border text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:bg-white transition-all outline-none font-bold ${errors['socialLinks.github'] ? 'border-rose-500' : 'border-zinc-300'}`}
                      value={formData.socialLinks.github}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          socialLinks: { ...formData.socialLinks, github: e.target.value }
                        });
                        if (errors['socialLinks.github']) setErrors({ ...errors, 'socialLinks.github': '' });
                      }}
                    />
                    {errors['socialLinks.github'] && <p className="text-xs text-rose-500 font-semibold mt-2 ml-1">{errors['socialLinks.github']}</p>}
                  </div>

                  {/* Twitter */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-400 group-focus-within:text-[#1DA1F2] transition-colors">
                      <FiTwitter size={18} />
                    </div>
                    <input
                      type="url"
                      placeholder="Twitter (X) URL"
                      className={`w-full pl-12 pr-6 py-4 bg-zinc-100 rounded-lg border text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:bg-white transition-all outline-none font-bold ${errors['socialLinks.twitter'] ? 'border-rose-500' : 'border-zinc-300'}`}
                      value={formData.socialLinks.twitter}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          socialLinks: { ...formData.socialLinks, twitter: e.target.value }
                        });
                        if (errors['socialLinks.twitter']) setErrors({ ...errors, 'socialLinks.twitter': '' });
                      }}
                    />
                    {errors['socialLinks.twitter'] && <p className="text-xs text-rose-500 font-semibold mt-2 ml-1">{errors['socialLinks.twitter']}</p>}
                  </div>

                  {/* Portfolio */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors">
                      <FiLink size={18} />
                    </div>
                    <input
                      type="url"
                      placeholder="Portfolio / Other Link"
                      className={`w-full pl-12 pr-6 py-4 bg-zinc-100 rounded-lg border text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:bg-white transition-all outline-none font-bold ${errors['socialLinks.portfolio'] ? 'border-rose-500' : 'border-zinc-300'}`}
                      value={formData.socialLinks.portfolio}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          socialLinks: { ...formData.socialLinks, portfolio: e.target.value }
                        });
                        if (errors['socialLinks.portfolio']) setErrors({ ...errors, 'socialLinks.portfolio': '' });
                      }}
                    />
                    {errors['socialLinks.portfolio'] && <p className="text-xs text-rose-500 font-semibold mt-2 ml-1">{errors['socialLinks.portfolio']}</p>}
                  </div>
                </div>
              </div>

              {/* Bio Textarea */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-zinc-700 ml-1">Bio</label>
                <div className="relative group">
                  <div className="absolute top-4 left-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors">
                    <FiEdit size={18} />
                  </div>
                  <textarea
                    name="bio"
                    placeholder="Tell us about your journey..."
                    className={`w-full pl-12 pr-6 py-4 bg-zinc-100 rounded-lg border text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:bg-white transition-all outline-none font-bold resize-none min-h-[160px] ${errors.bio ? 'border-rose-500' : 'border-zinc-300'}`}
                    value={formData.bio}
                    onChange={handleChange}
                    required
                  />
                </div>
                {errors.bio && <p className="text-xs text-rose-500 font-semibold mt-2 ml-1">{errors.bio}</p>}
              </div>
            </div>

            {/* Submit & Cancel Buttons */}
            <div className="pt-8 flex gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 py-3 bg-zinc-100 border border-zinc-300 text-zinc-700 text-xs font-semibold rounded-lg hover:bg-zinc-200 hover:text-zinc-900 transition-all"
              >
                Cancel
              </button>
              <LoadingButton
                type="submit"
                loading={loading}
                variant="contained"
                className="flex-1"
                sx={{
                  py: 1.2,
                  fontSize: '11px',
                  fontFamily: 'inherit',
                  textTransform: 'none',
                  borderRadius: '8px',
                  bgcolor: '#18181b',
                  '&:hover': { bgcolor: '#27272a' }
                }}
              >
                Save Changes
              </LoadingButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;