from django import forms
from .models import Person

class ProfileUpdateForm(forms.ModelForm):
    class Meta:
        model = Person
        fields = ['image']
        fields = ['background']