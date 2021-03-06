import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { Formik, Field, Form } from 'formik';
import { PersistFormikValues } from 'formik-persist-values';

import Button from '../Button';
import Modal from '../Modal';
import routes from '../../routes';

import {
  dailyCalories,
  dailyCaloriesAuth,
} from '../../redux/dailyCalories/dailyCalories_operation';
import { getIsAuthenticated } from '../../redux/auth/auth_selector';
import {
  getDailyCalories,
  getNotAllowedProducts,
} from '../../redux/dailyCalories/dailyCalories_selector';
import { getUserId } from '../../redux/user/user_selector';
import styles from './DailyCaloriesForm.module.css';
import { NavLink } from 'react-router-dom';

const DailyCaloriesForm = () => {
  const userId = useSelector(getUserId);
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const IsAuthenticated = useSelector(getIsAuthenticated);
  const calories = useSelector(getDailyCalories);
  const notAllowedProducts = useSelector(getNotAllowedProducts);

  const body = document.querySelector('body');

  const toggleModal = () => {
    if (body.classList.contains(styles.hidden)) {
      body.classList.remove(styles.hidden);
    } else {
      body.classList.add(styles.hidden);
    }
    setModal(!modal);
  };

  const handleSubmit = (values, userId) => {
    localStorage.setItem('bloodType', values.bloodType);

    localStorage.setItem('age', values.age);
    localStorage.setItem('currentWeight', values.currentWeight);
    localStorage.setItem('desiredWeight', values.desiredWeight);
    localStorage.setItem('height', values.height);
    localStorage.setItem('blood', values.bloodType);

    if (userId) {
      dispatch(dailyCaloriesAuth(values, userId));
    } else {
      dispatch(dailyCalories(values));
    }

    if (!IsAuthenticated) {
      toggleModal();
    }
  };

  const isChecked = () => {
    const store = localStorage.getItem('bloodType');
    if (store) {
      return store;
    }
    return '';
  };

  const validationsSchema = yup.object().shape({
    height: yup
      .number()
      .typeError('???????????? ???????? ????????????')
      .min(100, '?????????????????????? ???????????????? 120 ????')
      .max(260, '???????????????????????? ???????????????? 260 ????')
      .required('???????????????????????? ????????'),
    age: yup
      .number()
      .typeError('???????????? ???????? ????????????')
      .min(18, '?????????????????????? ???????????????? 18 ??????')
      .max(120, '???????????????????????? ???????????????? 120 ??????')
      .required('???????????????????????? ????????'),
    currentWeight: yup
      .number()
      .typeError('???????????? ???????? ????????????')
      .min(50, '?????????????????????? ???????????????? 50 ????')
      .max(250, '???????????????????????? ???????????????? 250 ????')
      .required('???????????????????????? ????????'),
    desiredWeight: yup
      .number()
      .typeError('???????????? ???????? ????????????')
      .min(45, '?????????????????????? ???????????????? 45 ????')
      .max(
        yup.ref('currentWeight'),
        '???????????????????????? ???????????????? ???? ?????????? ???????? ???????????? ????????????????',
      )
      .required('???????????????????????? ????????'),
    bloodType: yup.number().required('???????????????????????? ????????'),
  });

  const heading = () => {
    if (IsAuthenticated) {
      return '?????????? ???????? ???????????????? ?????????? ??????????????';
    }
    return '?????????????????? ???????? ???????????????? ?????????? ?????????????? ?????????? ????????????';
  };

  return (
    <>
      <div>
        <Formik
          initialValues={{
            height: '',
            age: '',
            currentWeight: '',
            desiredWeight: '',
            bloodType: `${isChecked()}`,
          }}
          validateOnBlur
          onSubmit={(values, actions) => {
            handleSubmit(values, userId);
            if (IsAuthenticated) {
              localStorage.removeItem('bloodType');
              localStorage.removeItem('calc-form');
              actions.resetForm();
            }
          }}
          validationSchema={validationsSchema}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            isValid,
            handleSubmit,
            dirty,
          }) => (
            <Form className={styles.caloriesForm} onSubmit={handleSubmit}>
              <h2>{heading()}</h2>
              <div className={styles.formContainerMain}>
                <div className={styles.formContainerLeft}>
                  <div className={styles.labelContainer}>
                    <InputField
                      label="???????? *"
                      type="number"
                      name={'height'}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.height}
                    />
                    <div className={styles.caloriesFormErrorContainer}>
                      {touched.height && errors.height && (
                        <p className={styles.caloriesFormError}>
                          {errors.height}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className={styles.labelContainer}>
                    <InputField
                      label="?????????????? *"
                      type="number"
                      name={'age'}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.age}
                    />
                    <div className={styles.caloriesFormErrorContainer}>
                      {touched.age && errors.age && (
                        <p className={styles.caloriesFormError}>{errors.age}</p>
                      )}
                    </div>
                  </div>
                  <div className={styles.labelContainer}>
                    <InputField
                      label="?????????????? ?????? *"
                      type="number"
                      name={'currentWeight'}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.currentWeight}
                    />
                    <div className={styles.caloriesFormErrorContainer}>
                      {touched.currentWeight && errors.currentWeight && (
                        <p className={styles.caloriesFormError}>
                          {errors.currentWeight}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className={styles.formContainerRight}>
                  <div className={styles.labelContainer}>
                    <InputField
                      label="???????????????? ?????? *"
                      type="number"
                      name={'desiredWeight'}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.desiredWeight}
                    />
                    <div className={styles.caloriesFormErrorContainer}>
                      {touched.desiredWeight && errors.desiredWeight && (
                        <p className={styles.caloriesFormError}>
                          {errors.desiredWeight}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className={styles.radioButtonContainer}>
                    <h3>???????????? ?????????? *</h3>

                    <ul className={styles.radioButtonList}>
                      <RadioButton
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="bloodType"
                        value="1"
                        id="1-radio-button"
                      />
                      <RadioButton
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="bloodType"
                        value="2"
                        id="2-radio-button"
                      />
                      <RadioButton
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="bloodType"
                        value="3"
                        id="3-radio-button"
                      />
                      <RadioButton
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="bloodType"
                        value="4"
                        id="4-radio-button"
                      />
                    </ul>
                    <div className={styles.caloriesFormErrorContainer}>
                      {touched.bloodType && errors.bloodType && (
                        <p className={styles.caloriesFormError}>
                          {errors.bloodType}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.form_button}>
                <Button
                  disabled={!isValid || !dirty}
                  onClick={handleSubmit}
                  type="submit"
                  text="????????????????"
                  customType="primary"
                />
              </div>

              <PersistFormikValues name="calc-form" ignoreValues="bloodType" />
            </Form>
          )}
        </Formik>
      </div>

      {modal && (
        <Modal onClose={toggleModal}>
          <h1 className={styles.modal_title}>
            ???????? ?????????????????????????? ???????????????? ?????????? ?????????????? ????????????????????
          </h1>
          <p className={styles.modal_caloriesNumber}>
            {calories}
            <span className={styles.modal_calories}> ????????</span>
          </p>
          <h2 className={styles.modal_subTitle}>
            ????????????????, ?????????????? ?????? ???? ?????????????????????????? ??????????????????????
          </h2>
          <ul className={styles.modal_list}>
            {notAllowedProducts ? (
              notAllowedProducts.map(product => (
                <li className={styles.modal_el} key={product} id={product}>
                  {product}
                </li>
              ))
            ) : (
              <li className={styles.modal_el}>???????????? ?????????? ??????</li>
            )}
          </ul>
          <div className={styles.modal_button}>
            <NavLink to={routes.registration}>
              <Button
                text="???????????? ????????????"
                customType="primary"
                type="button"
                onClick={toggleModal}
              />
            </NavLink>
          </div>
          <button
            type="button"
            className={styles.modal_closeBtn}
            onClick={toggleModal}
          ></button>
        </Modal>
      )}
    </>
  );
};

const InputField = ({ label, type, value, name, onChange, onBlur }) => (
  <label>
    <Field
      required
      type={type}
      value={value}
      name={name}
      onChange={onChange}
      onBlur={onBlur}
    />
    <div className={styles.labelText}>{label}</div>
  </label>
);

const RadioButton = ({ name, value, id, onChange, onBlur }) => (
  <li>
    <Field
      type="radio"
      value={value}
      name={name}
      id={id}
      onChange={onChange}
      onBlur={onBlur}
    />
    <label htmlFor={id}>{value}</label>
    <div className={styles.check}>
      <div className={styles.inside}></div>
    </div>
  </li>
);

export default DailyCaloriesForm;
