import React from 'react'
import { DateFormatter } from '../../resources/Utility'
import {
	TEXT,
	NUMB,
	TIME,
	BOOL,
	USER,
} from '../../resources/AttributeTypeConstants'
import BoolAndUsersDropDown from './BoolAndUsersDropDown'
import DateTimePickerComp from './DateTimePickerComp'
import Prompt from 'rn-prompt'

export default function RecurrentAttributeEditOrCreatePrompt({ name, type, toggleEditingState, onSubmit, value }) {
	switch (type) {
		case BOOL:
			return <BoolAndUsersDropDown label={name} type={BOOL} onSubmit={onSubmit} toggleEditingState={toggleEditingState}/>
		case USER:
			return <BoolAndUsersDropDown label={name} type={USER} onSubmit={onSubmit} toggleEditingState={toggleEditingState}/>
		case TIME:
			let date
			if (DateFormatter.isValidISODate(value)) {
				date = new Date(value)
			}
			return (
				<DateTimePickerComp
					title={`Edit '${name}'`}
					dateToDisplayWhenOpened={date}
					onDatePicked={onSubmit}
					onCancel={toggleEditingState}
				/>
			)
		default:
			// NUMB or TEXT
			return (
				<Prompt
					textInputProps={type === NUMB ? { keyboardType: 'numeric' } : {}}
					title={`Log a new value for ${name}`}
					placeholder="Enter value"
					defaultValue={value || ''}
					visible={true}
					onCancel={toggleEditingState}
					onSubmit={onSubmit}
				/>
			)
	}
}
